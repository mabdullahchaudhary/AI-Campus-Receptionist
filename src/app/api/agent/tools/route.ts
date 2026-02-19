import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const CLIENT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

async function searchKnowledge(query: string, category?: string): Promise<string> {
    try {
        let dbQuery = supabase
            .from("knowledge_base")
            .select("title, content")
            .eq("client_id", CLIENT_ID)
            .eq("is_active", true);

        if (category) dbQuery = dbQuery.eq("category", category);

        if (query) {
            const keywords = query.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2).slice(0, 5);
            if (keywords.length > 0) {
                const conditions = keywords.map((k) => `title.ilike.%${k}%,content.ilike.%${k}%`).join(",");
                dbQuery = dbQuery.or(conditions);
            }
        }

        const { data } = await dbQuery.limit(5);
        if (data && data.length > 0) {
            return data.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");
        }

        // Fallback: get all from category or general
        const { data: fallback } = await supabase
            .from("knowledge_base")
            .select("title, content")
            .eq("client_id", CLIENT_ID)
            .eq("is_active", true)
            .eq("category", category || "general")
            .limit(3);

        return fallback?.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n") || "No information found.";
    } catch {
        return "Knowledge base temporarily unavailable.";
    }
}

async function detectReturningCaller(phone: string): Promise<string> {
    if (!phone || phone.length < 5) return "New caller — no previous records found. Greet them warmly!";
    try {
        const { data: user } = await supabase
            .from("users")
            .select("full_name, phone, call_count, interested_program, lead_score, last_seen_at")
            .eq("client_id", CLIENT_ID)
            .eq("phone", phone)
            .single();

        if (user) {
            return `RETURNING CALLER DETECTED!\nName: ${user.full_name}\nPrevious calls: ${user.call_count || 1}\nInterested in: ${user.interested_program || "Not specified"}\nLead score: ${user.lead_score || "unknown"}\nLast contact: ${user.last_seen_at ? new Date(user.last_seen_at).toLocaleDateString() : "Unknown"}\n\nINSTRUCTION: Greet them by name! Say "Welcome back ${user.full_name}!" and reference their interest if known.`;
        }
        return "New caller — no previous records. Greet warmly and ask their name.";
    } catch {
        return "Could not check caller history. Treat as new caller.";
    }
}

async function scoreLead(name: string, phone: string, program: string, interest_level: string): Promise<string> {
    try {
        let score: string = "cold";
        if (interest_level === "high" || program) score = "hot";
        else if (interest_level === "medium") score = "warm";

        // Update if exists
        if (phone && phone.length > 5) {
            // First get current call count
            const { data: existing } = await supabase
                .from("users")
                .select("call_count")
                .eq("client_id", CLIENT_ID)
                .eq("phone", phone)
                .single();

            const currentCount = existing?.call_count || 0;

            await supabase
                .from("users")
                .update({
                    lead_score: score,
                    interested_program: program || null,
                    call_count: currentCount + 1,
                    last_seen_at: new Date().toISOString(),
                })
                .eq("client_id", CLIENT_ID)
                .eq("phone", phone);
        }

        const actions: Record<string, string> = {
            hot: "HIGH PRIORITY LEAD! This caller is very interested. Make sure to: 1) Save their contact, 2) Offer to book campus visit, 3) Share fee details, 4) Offer scholarship info.",
            warm: "WARM LEAD — Interested but needs more info. Share relevant details and offer to schedule a campus visit or callback.",
            cold: "COLD LEAD — Just exploring. Be helpful, provide info, and invite them to visit campus when ready.",
        };

        return `Lead scored as: ${score.toUpperCase()}\n${actions[score]}`;
    } catch {
        return "Lead scoring unavailable. Continue helping the caller normally.";
    }
}


async function scheduleCallback(name: string, phone: string, reason: string, time: string): Promise<string> {
    try {
        const { data, error } = await supabase.from("callbacks").insert({
            client_id: CLIENT_ID,
            caller_name: name || "Unknown",
            caller_phone: phone || "Not provided",
            reason: reason || "General inquiry follow-up",
            preferred_time: time || "Any time",
        }).select().single();

        if (error) throw error;
        return `Callback scheduled!\nName: ${data.caller_name}\nPhone: ${data.caller_phone}\nReason: ${data.reason}\nPreferred time: ${data.preferred_time}\n\nTell the caller: "We have noted your request. Our team will call you back at your preferred time. Thank you!"`;
    } catch {
        return "Could not schedule callback. Ask the caller to call back at 042-35761999 during office hours (9AM-5PM).";
    }
}

function getSmartGreeting(): string {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const urduGreeting = hour < 12 ? "Subah bakhair" : hour < 17 ? "Salam" : "Shaam bakhair";

    return `Time-aware greeting: It's ${timeOfDay} in Pakistan.\nUse: "Assalam-o-Alaikum! ${urduGreeting}! Superior University mein call karne ka shukriya."\nThen ask: "Main aapki kya madad kar sakta hoon?"`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const functionName = body.function_name || body.message?.functionCall?.name || "";
        const params = body.function_params || body.message?.functionCall?.parameters || {};
        const toolCallId = body.tool_call_id || body.message?.functionCall?.id || "call_1";

        let result = "";

        switch (functionName) {
            case "check_knowledge":
                result = await searchKnowledge(params.query || "", params.category || "");
                result = `KNOWLEDGE BASE:\n\n${result}\n\nUse this to answer accurately. Include specific numbers. Keep voice response under 3 sentences.`;
                break;

            case "check_fee":
                result = await searchKnowledge(params.program || params.query || "fee", "fees");
                result = `FEE INFORMATION:\n\n${result}\n\nMention: Payment plans available (full/2 installments/monthly). 5% discount for full payment.`;
                break;

            case "check_scholarship":
                result = await searchKnowledge(params.query || "scholarship", "scholarships");
                result = `SCHOLARSHIP INFO:\n\n${result}\n\nAsk the caller about their marks percentage to tell them exact scholarship they qualify for.`;
                break;

            case "check_hostel":
                result = await searchKnowledge("hostel", "hostel");
                result = `HOSTEL INFORMATION:\n\n${result}\n\nAsk if they need boys or girls hostel, and single/sharing preference.`;
                break;

            case "check_transport":
                result = await searchKnowledge("transport route", "transport");
                result = `TRANSPORT INFO:\n\n${result}\n\nAsk which area the caller lives in to suggest the right route.`;
                break;

            case "check_campus":
                result = await searchKnowledge("campus facilities", "campus");
                result = `CAMPUS INFO:\n\n${result}\n\nOffer to book a campus visit so they can see facilities in person.`;
                break;

            case "check_faq":
                result = await searchKnowledge(params.question || "", "general");
                result = `FAQ ANSWER:\n\n${result}\n\nAnswer directly and ask if they have more questions.`;
                break;

            case "check_departments":
                result = await searchKnowledge("departments programs", "departments");
                result = `DEPARTMENTS:\n\n${result}\n\nAsk which field interests them to give specific program details.`;
                break;

            case "check_admission_status":
                result = await searchKnowledge("admission", "admissions");
                result = `ADMISSIONS:\n\n${result}\n\nAsk if they want to apply now or schedule a visit.`;
                break;

            case "save_contact": {
                const name = (params.name || "").trim();
                const invalid = ["unknown", "null", "n/a", "", "undefined", "none", "no", "nahi"];
                if (invalid.includes(name.toLowerCase()) || name.length < 2) {
                    result = "Caller has NOT given a valid name. Ask politely: 'Aapka naam kya hai?' Do NOT save unknown names.";
                } else {
                    try {
                        const phone = (params.phone || "").replace(/unknown|null|n\/a|undefined|none/gi, "").trim();
                        const email = (params.email || "").replace(/unknown|null|n\/a|undefined|none/gi, "").trim();
                        await supabase.from("users").upsert({
                            client_id: CLIENT_ID,
                            full_name: name,
                            phone: phone || `web_${Date.now()}`,
                            email: email,
                            call_count: 1,
                        }, { onConflict: "client_id,phone" });
                        result = `Contact saved: ${name}. Thank the caller and continue helping.`;
                    } catch (e: any) {
                        result = `Could not save contact: ${e.message}. Continue helping the caller.`;
                    }
                }
                break;
            }

            case "book_visit": {
                try {
                    const { data } = await supabase.from("appointments").insert({
                        client_id: CLIENT_ID,
                        visitor_name: params.name || "Visitor",
                        visitor_phone: params.phone || "",
                        department: params.department || "Admissions",
                        purpose: params.purpose || "Campus Visit",
                        scheduled_at: params.datetime || new Date(Date.now() + 86400000).toISOString(),
                    }).select().single();
                    result = `Visit BOOKED! Name: ${data?.visitor_name}, Dept: ${data?.department}, Date: ${data?.scheduled_at}. Tell caller: "Your visit is confirmed! Bring CNIC. Address: 17-KM Raiwind Road, Lahore."`;
                } catch (e: any) {
                    result = `Could not book visit: ${e.message}. Ask caller to call 042-35761999 directly.`;
                }
                break;
            }

            case "detect_returning":
                result = await detectReturningCaller(params.phone || "");
                break;

            case "score_lead":
                result = await scoreLead(params.name || "", params.phone || "", params.program || "", params.interest_level || "medium");
                break;

            case "schedule_callback":
                result = await scheduleCallback(params.name || "", params.phone || "", params.reason || "", params.preferred_time || "");
                break;

            case "transfer_human":
                result = "Caller wants a human. Say: 'Main aapko humari reception se connect karta hoon. Agar connection na ho to 042-35761999 par call karein. Shukriya!'";
                break;

            case "end_conversation":
                result = "End the call gracefully. Say: 'Bohat shukriya aapka! Agar future mein koi sawal ho to 042-35761999 par call karein ya humari website visit karein. Allah Hafiz!'";
                break;

            default:
                result = await searchKnowledge(functionName + " " + JSON.stringify(params));
                result = `GENERAL RESPONSE:\n\n${result}\n\nUse this information to help the caller.`;
        }

        return NextResponse.json({
            results: [{
                toolCallId: toolCallId,
                result: result,
            }],
        });
    } catch (error: any) {
        console.error("Agent tools error:", error);
        return NextResponse.json({
            results: [{
                toolCallId: "call_1",
                result: "System error occurred. Apologize and ask the caller to try again or call 042-35761999 directly.",
            }],
        });
    }
}
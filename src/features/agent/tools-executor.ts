import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";
import { searchKnowledgeMarkdown } from "@/features/knowledge/knowledge-search";

const CLIENT_ID = DEFAULT_CLIENT_ID;

async function detectReturningCaller(phone: string): Promise<string> {
    if (!phone || phone.length < 5) {
        return "New caller — no previous records found. Greet them warmly.";
    }

    try {
        const { data: user } = await supabase
            .from("users")
            .select("full_name, phone, call_count, interested_program, lead_score, last_seen_at")
            .eq("client_id", CLIENT_ID)
            .eq("phone", phone)
            .single();

        if (user) {
            return `Returning caller detected.\nName: ${user.full_name}\nPrevious calls: ${user.call_count || 1}\nInterested in: ${user.interested_program || "Not specified"}\nLead score: ${user.lead_score || "unknown"}\nLast contact: ${
                user.last_seen_at ? new Date(user.last_seen_at).toLocaleDateString() : "Unknown"
            }. Greet them by name and reference their interest if known.`;
        }

        return "New caller — no previous records. Greet warmly and ask their name.";
    } catch {
        return "Could not check caller history. Treat as new caller.";
    }
}

async function scoreLead(name: string, phone: string, program: string, interestLevel: string): Promise<string> {
    try {
        let score: string = "cold";
        if (interestLevel === "high" || program) score = "hot";
        else if (interestLevel === "medium") score = "warm";

        if (phone && phone.length > 5) {
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
            hot: "High priority lead. Save contact, offer campus visit, share fee details, and scholarship info.",
            warm: "Warm lead. Share relevant details and offer to schedule a campus visit or callback.",
            cold: "Cold lead. Be helpful, provide information, and invite them to visit campus when ready.",
        };

        return `Lead scored as: ${score.toUpperCase()}.\n${actions[score]}`;
    } catch {
        return "Lead scoring unavailable. Continue helping the caller normally.";
    }
}

async function scheduleCallback(name: string, phone: string, reason: string, time: string): Promise<string> {
    try {
        const { data, error } = await supabase
            .from("callbacks")
            .insert({
                client_id: CLIENT_ID,
                caller_name: name || "Unknown",
                caller_phone: phone || "Not provided",
                reason: reason || "General inquiry follow-up",
                preferred_time: time || "Any time",
            })
            .select()
            .single();

        if (error) throw error;

        return `Callback scheduled.\nName: ${data.caller_name}\nPhone: ${data.caller_phone}\nReason: ${data.reason}\nPreferred time: ${data.preferred_time}. Inform the caller their callback is confirmed.`;
    } catch {
        return "Could not schedule callback. Ask the caller to call 042-35761999 during office hours (9AM-5PM).";
    }
}

function getSmartGreeting(): string {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const urduGreeting = hour < 12 ? "Subah bakhair" : hour < 17 ? "Salam" : "Shaam bakhair";

    return `Use a time-aware greeting for the ${timeOfDay} in Pakistan and say: Assalam-o-Alaikum, ${urduGreeting}. Thank the caller for contacting Superior University and ask how you can help.`;
}

export async function executeTool(functionName: string, params: any): Promise<string> {
    let result = "";

    switch (functionName) {
        case "check_knowledge": {
            const markdown = await searchKnowledgeMarkdown({
                query: params.query || "",
                category: params.category || "",
            });
            result = `Knowledge base:\n\n${markdown}\n\nUse this to answer accurately and concisely within three sentences.`;
            break;
        }

        case "check_fee": {
            const markdown = await searchKnowledgeMarkdown({
                query: params.program || params.query || "fee",
                category: "fees",
            });
            result = `Fee information:\n\n${markdown}\n\nMention payment plans and available discounts if present.`;
            break;
        }

        case "check_scholarship": {
            const markdown = await searchKnowledgeMarkdown({
                query: params.query || "scholarship",
                category: "scholarships",
            });
            result = `Scholarship information:\n\n${markdown}\n\nAsk the caller about their marks percentage to determine eligibility.`;
            break;
        }

        case "check_hostel": {
            const markdown = await searchKnowledgeMarkdown({
                query: "hostel",
                category: "hostel",
            });
            result = `Hostel information:\n\n${markdown}\n\nAsk if they need boys or girls hostel and single or shared room.`;
            break;
        }

        case "check_transport": {
            const markdown = await searchKnowledgeMarkdown({
                query: "transport route",
                category: "transport",
            });
            result = `Transport information:\n\n${markdown}\n\nAsk which area the caller lives in to suggest the correct route.`;
            break;
        }

        case "check_campus": {
            const markdown = await searchKnowledgeMarkdown({
                query: "campus facilities",
                category: "campus",
            });
            result = `Campus information:\n\n${markdown}\n\nOffer to book a campus visit so they can see facilities in person.`;
            break;
        }

        case "check_faq": {
            const markdown = await searchKnowledgeMarkdown({
                query: params.question || "",
                category: "general",
            });
            result = `FAQ answer:\n\n${markdown}\n\nAnswer directly and ask if they have more questions.`;
            break;
        }

        case "check_departments": {
            const markdown = await searchKnowledgeMarkdown({
                query: "departments programs",
                category: "departments",
            });
            result = `Departments:\n\n${markdown}\n\nAsk which field interests them to give specific program details.`;
            break;
        }

        case "check_admission_status": {
            const markdown = await searchKnowledgeMarkdown({
                query: "admission",
                category: "admissions",
            });
            result = `Admissions:\n\n${markdown}\n\nAsk if they want to apply now or schedule a visit.`;
            break;
        }

        case "save_contact": {
            const name = (params.name || "").trim();
            const invalid = ["unknown", "null", "n/a", "", "undefined", "none", "no", "nahi"];
            if (invalid.includes(name.toLowerCase()) || name.length < 2) {
                result =
                    "Caller has not given a valid name. Ask politely for their name and do not save unknown names.";
            } else {
                try {
                    const phone = (params.phone || "")
                        .replace(/unknown|null|n\/a|undefined|none/gi, "")
                        .trim();
                    const email = (params.email || "")
                        .replace(/unknown|null|n\/a|undefined|none/gi, "")
                        .trim();
                    await supabase.from("users").upsert(
                        {
                            client_id: CLIENT_ID,
                            full_name: name,
                            phone: phone || `web_${Date.now()}`,
                            email: email,
                            call_count: 1,
                        },
                        { onConflict: "client_id,phone" },
                    );
                    result = `Contact saved for ${name}. Thank the caller and continue helping.`;
                } catch (e: any) {
                    result = `Could not save contact: ${e.message}. Continue helping the caller.`;
                }
            }
            break;
        }

        case "book_visit": {
            try {
                const { data } = await supabase
                    .from("appointments")
                    .insert({
                        client_id: CLIENT_ID,
                        visitor_name: params.name || "Visitor",
                        visitor_phone: params.phone || "",
                        department: params.department || "Admissions",
                        purpose: params.purpose || "Campus Visit",
                        scheduled_at: params.datetime || new Date(Date.now() + 86400000).toISOString(),
                    })
                    .select()
                    .single();
                result = `Visit booked.\nName: ${data?.visitor_name}\nDepartment: ${data?.department}\nDate: ${
                    data?.scheduled_at
                }. Inform the caller their visit is confirmed and share campus address.`;
            } catch (e: any) {
                result = `Could not book visit: ${e.message}. Ask the caller to call 042-35761999 directly.`;
            }
            break;
        }

        case "detect_returning": {
            result = await detectReturningCaller(params.phone || "");
            break;
        }

        case "score_lead": {
            result = await scoreLead(
                params.name || "",
                params.phone || "",
                params.program || "",
                params.interest_level || "medium",
            );
            break;
        }

        case "schedule_callback": {
            result = await scheduleCallback(
                params.name || "",
                params.phone || "",
                params.reason || "",
                params.preferred_time || "",
            );
            break;
        }

        case "transfer_human": {
            result =
                "Caller wants a human. Politely inform them you will connect them to the human reception and share the direct number 042-35761999 in case the transfer fails.";
            break;
        }

        case "end_conversation": {
            result =
                "End the call gracefully. Thank the caller for contacting Superior University and invite them to call again or visit the website if they have more questions.";
            break;
        }

        default: {
            const markdown = await searchKnowledgeMarkdown({
                query: `${functionName} ${JSON.stringify(params)}`,
            });
            result = `General response:\n\n${markdown}\n\nUse this information to help the caller.`;
        }
    }

    if (!result && functionName === "check_knowledge") {
        result = getSmartGreeting();
    }

    return result;
}


import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { N8N_WEBHOOK_URL, VAPI_API_URL } from "@/lib/config";

function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return null;
    try {
        const decoded = JSON.parse(Buffer.from(token, "base64").toString());
        if (decoded.exp < Date.now()) return null;
        return decoded;
    } catch { return null; }
}

function getRileyConfig(serverUrl: string) {
    const systemPrompt = `# Identity
You are Riley, the AI Receptionist for Superior University, Lahore.

# CRITICAL RULES
1. For EVERY question → call check_knowledge FIRST
2. NEVER say "I don't know" — always search knowledge base
3. Include specific numbers, dates, PKR amounts
4. Keep voice responses to 2-3 sentences
5. Ask ONE follow-up after each answer

# Language: Match the caller (English/Urdu/Mixed)

# Tool Priority
- ANY question → check_knowledge
- Fee → check_fee | Scholarship → check_scholarship
- Hostel → check_hostel | Transport → check_transport
- Campus → check_campus | FAQ → check_faq
- Departments → check_departments | Admission → check_admission_status
- Name shared → save_contact | Visit → book_visit
- Callback → schedule_callback | Frustrated → transfer_human
- Goodbye → end_conversation

# Contact: NEVER save "unknown". Ask name FIRST, then phone.
# NEVER say "As an AI" or ask name+phone+email at once.`;

    const makeTool = (name: string, desc: string, params: Record<string, any> = {}, required: string[] = []) => ({
        type: "function" as const,
        function: {
            name,
            description: desc,
            parameters: {
                type: "object" as const,
                properties: params,
                required,
            },
        },
        server: { url: serverUrl },
    });

    return {
        name: "Riley - Superior AI",
        model: {
            provider: "openai",
            model: "gpt-4o-mini",
            temperature: 0.7,
            messages: [{ role: "system", content: systemPrompt }],
        },
        voice: {
            provider: "playht",
            voiceId: "jennifer",
        },
        firstMessage: "Assalam-o-Alaikum! Superior University mein call karne ka shukriya. Main Riley hoon, aapki kya madad kar sakta hoon?",
        serverUrl: serverUrl,
        maxDurationSeconds: 600,
        endCallFunctionEnabled: true,
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
        },
        clientMessages: [
            "transcript", "hang", "function-call",
            "speech-update", "metadata", "conversation-update",
        ],
        serverMessages: [
            "end-of-call-report", "function-call", "hang",
        ],
    };
}

function getToolsConfig(serverUrl: string) {
    const makeTool = (name: string, desc: string, params: Record<string, any> = {}, required: string[] = []) => ({
        type: "function" as const,
        function: {
            name,
            description: desc,
            parameters: {
                type: "object" as const,
                properties: params,
                required,
            },
        },
        server: { url: serverUrl },
    });

    return [
        makeTool("check_knowledge", "Search knowledge base for ANY question. ALWAYS use first.", { query: { type: "string", description: "The question" }, category: { type: "string", description: "admissions/fees/scholarships/departments/campus/contact/hostel/transport/general" } }, ["query"]),
        makeTool("check_fee", "Get exact fee for a program.", { program: { type: "string", description: "Program name" } }, ["program"]),
        makeTool("check_scholarship", "Check scholarship eligibility.", { query: { type: "string", description: "Question" }, marks_percentage: { type: "string", description: "Marks %" } }, ["query"]),
        makeTool("check_hostel", "Get hostel info and pricing.", {}),
        makeTool("check_transport", "Get bus routes and fees.", { area: { type: "string", description: "Caller area" } }),
        makeTool("check_campus", "Get campus facilities info.", { query: { type: "string", description: "Facility question" } }),
        makeTool("check_faq", "Answer FAQs.", { question: { type: "string", description: "The question" } }, ["question"]),
        makeTool("check_departments", "List departments and programs.", {}),
        makeTool("check_admission_status", "Get admission info.", { query: { type: "string", description: "Question" } }),
        makeTool("save_contact", "Save caller contact. Real names ONLY.", { name: { type: "string", description: "Full name" }, phone: { type: "string", description: "Phone" }, email: { type: "string", description: "Email" } }, ["name"]),
        makeTool("book_visit", "Schedule campus visit.", { name: { type: "string", description: "Name" }, phone: { type: "string", description: "Phone" }, department: { type: "string", description: "Department" }, datetime: { type: "string", description: "Date/time" } }, ["name"]),
        makeTool("detect_returning", "Check if returning caller.", { phone: { type: "string", description: "Phone" } }, ["phone"]),
        makeTool("score_lead", "Rate caller interest.", { name: { type: "string", description: "Name" }, phone: { type: "string", description: "Phone" }, program: { type: "string", description: "Program" }, interest_level: { type: "string", description: "high/medium/low" } }, ["name", "interest_level"]),
        makeTool("schedule_callback", "Schedule follow-up call.", { name: { type: "string", description: "Name" }, phone: { type: "string", description: "Phone" }, reason: { type: "string", description: "Reason" }, preferred_time: { type: "string", description: "When" } }, ["name", "phone"]),
        makeTool("transfer_human", "Transfer to human.", {}),
        makeTool("end_conversation", "End call gracefully.", {}),
    ];
}

export async function POST(req: NextRequest) {
    const admin = verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    try {
        switch (action) {
            case "clone_to_account": {
                const { providerId } = body;

                const { data: provider } = await supabase
                    .from("credit_providers")
                    .select("*")
                    .eq("id", providerId)
                    .single();

                if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
                if (!provider.api_key_private) return NextResponse.json({ error: "Private API key required" }, { status: 400 });

                const serverUrl = N8N_WEBHOOK_URL;

                // Step 1: Create assistant (without tools — Vapi API requirement)
                const assistantConfig = getRileyConfig(serverUrl);

                const createRes = await fetch(`${VAPI_API_URL}/assistant`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${provider.api_key_private}`,
                    },
                    body: JSON.stringify(assistantConfig),
                });

                if (!createRes.ok) {
                    const errText = await createRes.text();
                    console.error("Vapi create error:", errText);
                    return NextResponse.json({ error: `Vapi error: ${errText}` }, { status: 400 });
                }

                const assistant = await createRes.json();

                // Step 2: Update assistant with tools (PATCH request)
                const tools = getToolsConfig(serverUrl);

                const updateRes = await fetch(`${VAPI_API_URL}/assistant/${assistant.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${provider.api_key_private}`,
                    },
                    body: JSON.stringify({
                        model: {
                            ...assistantConfig.model,
                            tools: tools,
                        },
                    }),
                });

                if (!updateRes.ok) {
                    const errText = await updateRes.text();
                    console.error("Vapi update tools error:", errText);
                    // Assistant created but tools failed — still save
                }

                // Step 3: Save assistant ID
                await supabase
                    .from("credit_providers")
                    .update({ assistant_id: assistant.id, last_checked_at: new Date().toISOString() })
                    .eq("id", providerId);

                return NextResponse.json({
                    success: true,
                    assistantId: assistant.id,
                    message: `Riley cloned to ${provider.account_email}!`,
                });
            }

            case "clone_to_all": {
                const { data: providers } = await supabase
                    .from("credit_providers")
                    .select("*")
                    .eq("is_active", true)
                    .not("api_key_private", "is", null);

                if (!providers?.length) {
                    return NextResponse.json({ error: "No accounts with private keys" }, { status: 400 });
                }

                const serverUrl = N8N_WEBHOOK_URL;
                const assistantConfig = getRileyConfig(serverUrl);
                const tools = getToolsConfig(serverUrl);
                const results = [];

                for (const provider of providers) {
                    try {
                        // Skip if already cloned
                        if (provider.assistant_id) {
                            results.push({ email: provider.account_email, status: "skipped", message: "Already cloned" });
                            continue;
                        }

                        // Create assistant
                        const createRes = await fetch(`${VAPI_API_URL}/assistant`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${provider.api_key_private}`,
                            },
                            body: JSON.stringify(assistantConfig),
                        });

                        if (!createRes.ok) {
                            const err = await createRes.text();
                            results.push({ email: provider.account_email, status: "failed", error: err });
                            continue;
                        }

                        const assistant = await createRes.json();

                        // Add tools
                        await fetch(`${VAPI_API_URL}/assistant/${assistant.id}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${provider.api_key_private}`,
                            },
                            body: JSON.stringify({ model: { ...assistantConfig.model, tools } }),
                        });

                        // Save
                        await supabase
                            .from("credit_providers")
                            .update({ assistant_id: assistant.id, last_checked_at: new Date().toISOString() })
                            .eq("id", provider.id);

                        results.push({ email: provider.account_email, status: "success", assistantId: assistant.id });
                    } catch (e: any) {
                        results.push({ email: provider.account_email, status: "failed", error: e.message });
                    }
                }

                const successCount = results.filter((r) => r.status === "success").length;
                return NextResponse.json({ success: true, results, message: `Cloned to ${successCount} accounts` });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
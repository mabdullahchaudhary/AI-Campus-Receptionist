import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Verify admin token
function verifyAdmin(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) return null;
    try {
        const decoded = JSON.parse(Buffer.from(token, "base64").toString());
        if (decoded.exp < Date.now()) return null;
        return decoded;
    } catch { return null; }
}

// The FULL Riley assistant configuration — all 16 tools
function getRileyConfig(serverUrl: string) {
    return {
        name: "Riley — Superior University AI Receptionist",
        model: {
            provider: "openai",
            model: "gpt-4o-mini",
            temperature: 0.7,
            systemPrompt: `# Identity
You are Riley, the AI Receptionist for Superior University, Lahore — Pakistan's leading private university on Raiwind Road.

# CRITICAL RULES
1. For EVERY university question → call check_knowledge FIRST
2. For fee questions → call check_fee with the program name
3. For scholarship → call check_scholarship
4. NEVER say "I don't know" — always search knowledge base
5. NEVER redirect to website without first checking knowledge
6. Include specific numbers, dates, and PKR amounts
7. Keep voice responses to 2-3 sentences max
8. Ask ONE follow-up question after each answer

# Language Detection
- English caller → respond in English
- Urdu caller → respond in Urdu
- Mixed (Urdlish) → respond in same mixed style

# Tool Priority
- ANY question → check_knowledge first
- Fee/cost → check_fee
- Scholarship/discount → check_scholarship
- Hostel → check_hostel
- Transport/bus → check_transport
- Campus → check_campus
- FAQ → check_faq
- Programs → check_departments
- Admission → check_admission_status
- Name shared → save_contact (real names ONLY)
- Visit request → book_visit
- Callback request → schedule_callback
- Frustrated → transfer_human
- Goodbye → end_conversation

# Contact Rules
- NEVER save "unknown", "null", empty names
- Ask name FIRST, then phone. ONE at a time.

# Personality
- Warm, professional, knowledgeable
- Confident (backed by knowledge base)
- Proactive: suggest related info and campus visits

# NEVER DO
- Never say "As an AI" or "I'm a bot"
- Never give vague answers when knowledge base has specifics
- Never ask for name, phone, and email all at once`,
        },
        voice: {
            provider: "playht",
            voiceId: "jennifer",
        },
        firstMessage: "Assalam-o-Alaikum! Superior University mein call karne ka shukriya. Main Riley hoon, aapki kya madad kar sakta hoon?",
        serverUrl: serverUrl,
        maxDurationSeconds: 600,
        endCallFunctionEnabled: true,
        tools: [
            {
                type: "function",
                function: {
                    name: "check_knowledge",
                    description: "Search the university knowledge base for ANY question. ALWAYS use this first.",
                    parameters: { type: "object", properties: { query: { type: "string", description: "The caller's question" }, category: { type: "string", description: "Category: admissions, fees, scholarships, departments, campus, contact, hostel, transport, general" } }, required: ["query"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_fee",
                    description: "Get exact fee for a specific program. Use when caller asks about costs.",
                    parameters: { type: "object", properties: { program: { type: "string", description: "Program name like BS Computer Science or MBA" }, query: { type: "string", description: "Additional fee question" } }, required: ["program"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_scholarship",
                    description: "Check scholarship eligibility. Use when caller asks about financial aid or discounts.",
                    parameters: { type: "object", properties: { query: { type: "string", description: "Scholarship question" }, marks_percentage: { type: "string", description: "Caller's marks percentage" } }, required: ["query"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_hostel",
                    description: "Get hostel availability, pricing, and facilities.",
                    parameters: { type: "object", properties: {} },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_transport",
                    description: "Get bus routes, timings, and transport fees.",
                    parameters: { type: "object", properties: { area: { type: "string", description: "Caller's area or location" } } },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_campus",
                    description: "Get campus facilities and amenities information.",
                    parameters: { type: "object", properties: { query: { type: "string", description: "Specific facility question" } } },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_faq",
                    description: "Answer frequently asked questions about HEC, transfers, refunds, etc.",
                    parameters: { type: "object", properties: { question: { type: "string", description: "The FAQ question" } }, required: ["question"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_departments",
                    description: "List all departments and programs offered.",
                    parameters: { type: "object", properties: {} },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "check_admission_status",
                    description: "Get admission dates, process, and requirements.",
                    parameters: { type: "object", properties: { query: { type: "string", description: "Specific admission question" } } },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "save_contact",
                    description: "Save caller's contact. ONLY when caller gives their REAL name.",
                    parameters: { type: "object", properties: { name: { type: "string", description: "Caller's full name" }, phone: { type: "string", description: "Phone number" }, email: { type: "string", description: "Email" } }, required: ["name"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "book_visit",
                    description: "Schedule a campus visit for the caller.",
                    parameters: { type: "object", properties: { name: { type: "string", description: "Visitor name" }, phone: { type: "string", description: "Phone" }, department: { type: "string", description: "Department to visit" }, purpose: { type: "string", description: "Visit purpose" }, datetime: { type: "string", description: "Preferred date/time" } }, required: ["name"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "detect_returning",
                    description: "Check if caller has called before. Use when phone number is available.",
                    parameters: { type: "object", properties: { phone: { type: "string", description: "Caller's phone number" } }, required: ["phone"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "score_lead",
                    description: "Rate how interested a caller is after understanding their needs.",
                    parameters: { type: "object", properties: { name: { type: "string", description: "Caller name" }, phone: { type: "string", description: "Phone" }, program: { type: "string", description: "Interested program" }, interest_level: { type: "string", description: "high, medium, or low" } }, required: ["name", "interest_level"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "schedule_callback",
                    description: "Schedule a callback from university staff.",
                    parameters: { type: "object", properties: { name: { type: "string", description: "Caller name" }, phone: { type: "string", description: "Phone number" }, reason: { type: "string", description: "Callback reason" }, preferred_time: { type: "string", description: "When to call back" } }, required: ["name", "phone"] },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "transfer_human",
                    description: "Transfer to human receptionist. Use when frustrated or asks for human.",
                    parameters: { type: "object", properties: {} },
                },
                server: { url: serverUrl },
            },
            {
                type: "function",
                function: {
                    name: "end_conversation",
                    description: "End conversation gracefully when caller says goodbye.",
                    parameters: { type: "object", properties: {} },
                },
                server: { url: serverUrl },
            },
        ],
    };
}

export async function POST(req: NextRequest) {
    const admin = verifyAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    try {
        switch (action) {
            // Clone Riley to a specific provider account
            case "clone_to_account": {
                const { providerId } = body;

                // Get provider account details
                const { data: provider } = await supabase
                    .from("credit_providers")
                    .select("*")
                    .eq("id", providerId)
                    .single();

                if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
                if (!provider.api_key_private) return NextResponse.json({ error: "Private API key required for cloning" }, { status: 400 });

                const serverUrl = "https://superiorproject.app.n8n.cloud/webhook/ai-receptionist";
                const config = getRileyConfig(serverUrl);

                // Create assistant on the new account via Vapi API
                const vapiRes = await fetch("https://api.vapi.ai/assistant", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${provider.api_key_private}`,
                    },
                    body: JSON.stringify(config),
                });

                if (!vapiRes.ok) {
                    const errText = await vapiRes.text();
                    return NextResponse.json({ error: `Vapi API error: ${errText}` }, { status: 400 });
                }

                const assistant = await vapiRes.json();

                // Save assistant ID back to provider record
                await supabase
                    .from("credit_providers")
                    .update({
                        assistant_id: assistant.id,
                        last_checked_at: new Date().toISOString(),
                    })
                    .eq("id", providerId);

                return NextResponse.json({
                    success: true,
                    assistantId: assistant.id,
                    assistantName: assistant.name,
                    message: `Riley cloned successfully to ${provider.account_email}!`,
                });
            }

            // Clone to ALL active provider accounts at once
            case "clone_to_all": {
                const { data: providers } = await supabase
                    .from("credit_providers")
                    .select("*")
                    .eq("is_active", true)
                    .not("api_key_private", "is", null);

                if (!providers || providers.length === 0) {
                    return NextResponse.json({ error: "No provider accounts with private keys found" }, { status: 400 });
                }

                const serverUrl = "https://superiorproject.app.n8n.cloud/webhook/ai-receptionist";
                const config = getRileyConfig(serverUrl);
                const results = [];

                for (const provider of providers) {
                    try {
                        const vapiRes = await fetch("https://api.vapi.ai/assistant", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${provider.api_key_private}`,
                            },
                            body: JSON.stringify(config),
                        });

                        if (vapiRes.ok) {
                            const assistant = await vapiRes.json();
                            await supabase
                                .from("credit_providers")
                                .update({ assistant_id: assistant.id, last_checked_at: new Date().toISOString() })
                                .eq("id", provider.id);

                            results.push({ email: provider.account_email, status: "success", assistantId: assistant.id });
                        } else {
                            const errText = await vapiRes.text();
                            results.push({ email: provider.account_email, status: "failed", error: errText });
                        }
                    } catch (e: any) {
                        results.push({ email: provider.account_email, status: "failed", error: e.message });
                    }
                }

                return NextResponse.json({ success: true, results });
            }

            // Check credits on a specific account
            case "check_credits": {
                const { providerId } = body;

                const { data: provider } = await supabase
                    .from("credit_providers")
                    .select("*")
                    .eq("id", providerId)
                    .single();

                if (!provider || !provider.api_key_private) {
                    return NextResponse.json({ error: "Provider not found or missing private key" }, { status: 400 });
                }

                // Vapi doesn't have a direct credits API, but we can check by listing calls
                // For now, we update manually from admin dashboard
                return NextResponse.json({
                    provider: provider.provider,
                    email: provider.account_email,
                    credits: provider.credits_remaining,
                    message: "Update credits manually from Vapi dashboard for now",
                });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
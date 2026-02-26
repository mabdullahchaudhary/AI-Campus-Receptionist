import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { VAPI_API_URL, N8N_WEBHOOK_URL } from "@/lib/config";
import { buildSystemPrompt } from "@/lib/ai/prompt";
import { verifyAdminToken } from "@/features/auth/admin/token";
import { getAllTools } from "@/features/agent/tools-registry";

async function cloneToAccount(provider: any) {
    const privateKey = provider.api_key_private;
    const tools = getAllTools();
    const createdToolIds: string[] = [];
    const toolResults: any[] = [];

    // STEP 1: Create all 16 tools on the new account
    for (const tool of tools) {
        try {
            const res = await fetch(`${VAPI_API_URL}/tool`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${privateKey}`,
                },
                body: JSON.stringify(tool),
            });

            if (res.ok) {
                const created = await res.json();
                createdToolIds.push(created.id);
                toolResults.push({ name: tool.function.name, status: "created", id: created.id });
            } else {
                const err = await res.text();
                toolResults.push({ name: tool.function.name, status: "failed", error: err });
            }
        } catch (e: any) {
            toolResults.push({ name: tool.function.name, status: "failed", error: e.message });
        }
    }

        // STEP 2: Create the assistant with toolIds referencing the new tools
        // Use centralized prompt builder for dynamic, multi-tenant prompt injection
        const systemPrompt = buildSystemPrompt({
            clientConfig: {
                universityName: "Superior University",
                city: "Lahore",
                phone: "042-35761999",
                website: "www.superior.edu.pk",
            },
        });

    const assistantConfig = {
        name: "Riley",
        firstMessage: "Assalam-o-Alaikum! Superior University mein call karne ka shukriya. I'm here to help you with admissions, campus visits, fee structure, department information, or any other questions. Aap kaise help chahte hain aaj?",
        voicemailMessage: "Assalam-o-Alaikum, this is the AI Receptionist from Superior University. Please call us back at 042-35761999. Thank you!",
        endCallMessage: "Thank you for calling Superior University! Allah Hafiz!",
        endCallPhrases: ["goodbye", "talk to you soon"],
        model: {
            provider: "groq",
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            toolIds: createdToolIds,
            messages: [{ role: "system", content: systemPrompt }],
        },
        voice: {
            provider: "vapi",
            voiceId: "Elliot",
            fallbackPlan: { voices: [{ provider: "vapi", voiceId: "Dan" }] },
        },
        transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
            endpointing: 150,
        },
        server: {
            url: N8N_WEBHOOK_URL,
            timeoutSeconds: 20,
        },
        startSpeakingPlan: {
            waitSeconds: 0.4,
            smartEndpointingEnabled: "livekit",
        },
        backgroundSound: "off",
        messagePlan: {
            idleMessages: ["I'm still here if you need assistance."],
        },
        clientMessages: [
            "conversation-update", "function-call", "hang", "model-output",
            "speech-update", "status-update", "transfer-update", "transcript",
            "tool-calls", "user-interrupted", "voice-input",
        ],
        serverMessages: [
            "conversation-update", "end-of-call-report", "function-call",
            "hang", "speech-update", "status-update", "tool-calls",
            "transfer-destination-request", "user-interrupted",
        ],
    };

    const createRes = await fetch(`${VAPI_API_URL}/assistant`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${privateKey}`,
        },
        body: JSON.stringify(assistantConfig),
    });

    if (!createRes.ok) {
        const err = await createRes.text();
        throw new Error(`Assistant creation failed: ${err}`);
    }

    const assistant = await createRes.json();

    // Save to database
    await supabase
        .from("credit_providers")
        .update({ assistant_id: assistant.id, last_checked_at: new Date().toISOString() })
        .eq("id", provider.id);

    return {
        assistantId: assistant.id,
        toolsCreated: createdToolIds.length,
        totalTools: tools.length,
        toolResults,
    };
}

export async function POST(req: NextRequest) {
    const admin = verifyAdminToken(req.cookies.get("admin_token")?.value);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    try {
        switch (action) {
            case "clone_to_account": {
                const { providerId } = body;
                const { data: provider } = await supabase.from("credit_providers").select("*").eq("id", providerId).single();
                if (!provider) return NextResponse.json({ error: "Provider not found" }, { status: 404 });
                if (!provider.api_key_private) return NextResponse.json({ error: "Private API key required" }, { status: 400 });

                const result = await cloneToAccount(provider);

                return NextResponse.json({
                    success: true,
                    assistantId: result.assistantId,
                    toolsCreated: result.toolsCreated,
                    totalTools: result.totalTools,
                    toolResults: result.toolResults,
                    account: provider.account_email,
                    message: `✅ Riley cloned! ${result.toolsCreated}/${result.totalTools} tools created on ${provider.account_email}`,
                });
            }

            case "clone_to_all": {
                const { data: providers } = await supabase.from("credit_providers").select("*").eq("is_active", true).not("api_key_private", "is", null);
                if (!providers?.length) return NextResponse.json({ error: "No accounts with private keys" }, { status: 400 });

                const results: any[] = [];
                for (const provider of providers) {
                    if (provider.assistant_id) {
                        results.push({ email: provider.account_email, status: "skipped", reason: "Already cloned" });
                        continue;
                    }
                    try {
                        const result = await cloneToAccount(provider);
                        results.push({ email: provider.account_email, status: "success", assistantId: result.assistantId, toolsCreated: result.toolsCreated });
                    } catch (e: any) {
                        results.push({ email: provider.account_email, status: "failed", error: e.message });
                    }
                }

                const success = results.filter((r) => r.status === "success").length;
                return NextResponse.json({ success: true, results, message: `✅ Cloned ${success} accounts!` });
            }

            case "reclone_account": {
                const { providerId } = body;
                const { data: provider } = await supabase.from("credit_providers").select("*").eq("id", providerId).single();
                if (!provider?.api_key_private) return NextResponse.json({ error: "Missing private key" }, { status: 400 });

                // Delete old assistant and its tools
                if (provider.assistant_id) {
                    try {
                        // Get old assistant to find toolIds
                        const oldRes = await fetch(`${VAPI_API_URL}/assistant/${provider.assistant_id}`, { headers: { "Authorization": `Bearer ${provider.api_key_private}` } });
                        if (oldRes.ok) {
                            const oldAssistant = await oldRes.json();
                            const oldToolIds = oldAssistant.model?.toolIds || [];
                            // Delete old tools
                            for (const toolId of oldToolIds) {
                                try { await fetch(`${VAPI_API_URL}/tool/${toolId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${provider.api_key_private}` } }); } catch { }
                            }
                        }
                        // Delete old assistant
                        await fetch(`${VAPI_API_URL}/assistant/${provider.assistant_id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${provider.api_key_private}` } });
                    } catch { }
                    await supabase.from("credit_providers").update({ assistant_id: null }).eq("id", providerId);
                }

                const result = await cloneToAccount(provider);
                return NextResponse.json({ success: true, assistantId: result.assistantId, toolsCreated: result.toolsCreated, message: `♻️ Re-cloned! ${result.toolsCreated}/16 tools + Riley created!` });
            }

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Clone error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
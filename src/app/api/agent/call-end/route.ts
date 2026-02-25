import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { call_id, transcript, summary, duration, caller_phone, client_id } = body;

        const targetClientId = client_id || DEFAULT_CLIENT_ID;

        // Save call log
        await supabase.from("call_logs").insert({
            client_id: targetClientId,
            session_id: call_id || `call_${Date.now()}`,
            status: "completed",
            transcript: (transcript || "").substring(0, 10000),
            ai_summary: (summary || "").substring(0, 2000),
            duration_seconds: duration || 0,
            ended_at: new Date().toISOString(),
        }).then(({ error }) => { if (error) console.error("Call log error:", error); });

        // Update caller's call count if phone known
        if (caller_phone && caller_phone.length > 5) {
            const { data: existingUser } = await supabase
                .from("users")
                .select("id, call_count")
                .eq("client_id", targetClientId)
                .eq("phone", caller_phone)
                .single();

            if (existingUser) {
                await supabase
                    .from("users")
                    .update({
                        call_count: (existingUser.call_count || 0) + 1,
                        last_seen_at: new Date().toISOString(),
                    })
                    .eq("id", existingUser.id);
            }
        }

        return NextResponse.json({ status: "logged" });
    } catch (error: any) {
        console.error("Call end error:", error);
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
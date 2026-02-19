import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const body = await req.json();
        const { fingerprint, seconds } = body;

        const userId = session?.user?.id || null;
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "0.0.0.0";

        const promises = [];

        // Layer: User ID
        if (userId) {
            promises.push(
                supabase.rpc("record_call_usage", {
                    p_identity_key: userId,
                    p_identity_type: "user_id",
                    p_seconds: seconds || 0,
                })
            );
        }

        // Layer: IP
        promises.push(
            supabase.rpc("record_call_usage", {
                p_identity_key: ip,
                p_identity_type: "ip",
                p_seconds: seconds || 0,
            })
        );

        // Layer: Fingerprint
        if (fingerprint) {
            promises.push(
                supabase.rpc("record_call_usage", {
                    p_identity_key: fingerprint,
                    p_identity_type: "fingerprint",
                    p_seconds: seconds || 0,
                })
            );

            // Increment fingerprint call count using raw SQL
            promises.push(
                supabase.rpc("increment_fingerprint_calls", {
                    p_fingerprint: fingerprint,
                })
            );
        }

        await Promise.allSettled(promises);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Usage recording error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
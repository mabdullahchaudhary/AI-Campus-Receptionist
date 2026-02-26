import { NextResponse } from "next/server";
import { errorRedirect } from "@/lib/error-redirect";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) return errorRedirect({ headers: { get: () => "text/html" } } as any, 401, "Unauthorized");

        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .eq("client_id", DEFAULT_CLIENT_ID)
            .order("scheduled_at", { ascending: false })
            .limit(100);

        if (error) throw error;
        return NextResponse.json({ appointments: data || [] });
    } catch (error: any) {
        return errorRedirect({ headers: { get: () => "text/html" } } as any, 500, error.message);
    }
}
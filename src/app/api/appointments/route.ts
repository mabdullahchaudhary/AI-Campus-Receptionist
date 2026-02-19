import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("appointments")
            .select("*")
            .eq("client_id", DEFAULT_CLIENT_ID)
            .order("scheduled_at", { ascending: false })
            .limit(100);

        if (error) throw error;
        return NextResponse.json({ appointments: data || [] });
    } catch (error: any) {
        return NextResponse.json({ appointments: [], error: error.message }, { status: 500 });
    }
}
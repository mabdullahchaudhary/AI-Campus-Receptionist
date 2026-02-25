import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, category, client_id } = body;

        // Allow callers to specify a tenant; fall back to the default demo tenant
        const targetClientId = client_id || DEFAULT_CLIENT_ID;

        if (category) {
            const { data, error } = await supabase
                .from("knowledge_base")
                .select("title, content, category")
                .eq("client_id", targetClientId)
                .eq("is_active", true)
                .eq("category", category)
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) throw error;

            if (data && data.length > 0) {
                const formatted = data.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");
                return NextResponse.json({ found: true, count: data.length, knowledge: formatted });
            }
        }

        if (query) {
            const keywords = query
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .split(/\s+/)
                .filter((w: string) => w.length > 2)
                .slice(0, 5);

            if (keywords.length > 0) {
                const conditions = keywords
                    .map((k: string) => `title.ilike.%${k}%,content.ilike.%${k}%`)
                    .join(",");

                const { data, error } = await supabase
                    .from("knowledge_base")
                    .select("title, content, category")
                    .eq("client_id", targetClientId)
                    .eq("is_active", true)
                    .or(conditions)
                    .limit(5);

                if (error) throw error;

                if (data && data.length > 0) {
                    const formatted = data.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");
                    return NextResponse.json({ found: true, count: data.length, knowledge: formatted });
                }
            }
        }

        const { data: allData, error: allError } = await supabase
            .from("knowledge_base")
            .select("title, content, category")
            .eq("client_id", targetClientId)
            .eq("is_active", true)
            .order("category", { ascending: true })
            .limit(10);

        if (allError) throw allError;

        const formatted = (allData || []).map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");

        return NextResponse.json({
            found: (allData?.length || 0) > 0,
            count: allData?.length || 0,
            knowledge: formatted || "No knowledge base entries found.",
        });
    } catch (error: any) {
        console.error("Knowledge API error:", error);
        return NextResponse.json(
            { found: false, count: 0, knowledge: "Knowledge base temporarily unavailable. Answer from general knowledge about Superior University Lahore." },
            { status: 500 }
        );
    }
}

export async function GET() {
    const { data, error } = await supabase
        .from("knowledge_base")
        .select("id, title, category, is_active")
        .eq("client_id", DEFAULT_CLIENT_ID)
        .eq("is_active", true)
        .order("category", { ascending: true });

    return NextResponse.json({ total: data?.length || 0, entries: data || [], error: error?.message || null });
}
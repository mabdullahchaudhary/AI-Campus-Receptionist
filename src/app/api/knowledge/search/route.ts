import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Public API — n8n calls this to get knowledge for AI
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, client_id, category } = body;

        const targetClientId = client_id || "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

        let dbQuery = supabase
            .from("knowledge_base")
            .select("title, content, category, content_type")
            .eq("client_id", targetClientId)
            .eq("is_active", true);

        if (category) {
            dbQuery = dbQuery.eq("category", category);
        }

        // If there's a search query, filter by it
        if (query) {
            const keywords = query
                .toLowerCase()
                .split(/\s+/)
                .filter((w: string) => w.length > 2);

            if (keywords.length > 0) {
                const orConditions = keywords
                    .map((k: string) => `title.ilike.%${k}%,content.ilike.%${k}%`)
                    .join(",");
                dbQuery = dbQuery.or(orConditions);
            }
        }

        const { data, error } = await dbQuery.limit(10);

        if (error) throw error;

        // Format for AI consumption
        const knowledgeText = (data || [])
            .map((entry) => `## ${entry.title}\n${entry.content}`)
            .join("\n\n---\n\n");

        return NextResponse.json({
            results: data || [],
            formatted: knowledgeText,
            count: data?.length || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
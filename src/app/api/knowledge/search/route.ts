import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

// Public endpoint consumed by n8n to retrieve knowledge for AI context injection
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, client_id, category } = body;

        const targetClientId = client_id || DEFAULT_CLIENT_ID;

        let dbQuery = supabase
            .from("knowledge_base")
            .select("title, content, category, content_type")
            .eq("client_id", targetClientId)
            .eq("is_active", true);

        if (category) {
            dbQuery = dbQuery.eq("category", category);
        }

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

        return NextResponse.json({
            results: data || [],
            count: data?.length || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
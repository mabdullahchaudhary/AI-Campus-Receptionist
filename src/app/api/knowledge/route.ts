import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * PUBLIC API — n8n calls this to get knowledge for the AI agent
 * No auth required — called by n8n webhook workflow
 *
 * POST /api/agent/knowledge
 * Body: { query: "fee structure", category: "fees" }
 * Returns: formatted text for AI to read
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, category, client_id } = body;

        const targetClientId =
            client_id || "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

        // Strategy 1: If category is provided, get all entries in that category
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
                const formatted = data
                    .map((e) => `## ${e.title}\n${e.content}`)
                    .join("\n\n---\n\n");

                return NextResponse.json({
                    found: true,
                    count: data.length,
                    knowledge: formatted,
                });
            }
        }

        // Strategy 2: Search by keywords from query
        if (query) {
            const keywords = query
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .split(/\s+/)
                .filter((w: string) => w.length > 2)
                .slice(0, 5); // Max 5 keywords

            if (keywords.length > 0) {
                // Build OR conditions for each keyword
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
                    const formatted = data
                        .map((e) => `## ${e.title}\n${e.content}`)
                        .join("\n\n---\n\n");

                    return NextResponse.json({
                        found: true,
                        count: data.length,
                        knowledge: formatted,
                    });
                }
            }
        }

        // Strategy 3: If nothing found, return ALL active knowledge
        const { data: allData, error: allError } = await supabase
            .from("knowledge_base")
            .select("title, content, category")
            .eq("client_id", targetClientId)
            .eq("is_active", true)
            .order("category", { ascending: true })
            .limit(10);

        if (allError) throw allError;

        const formatted = (allData || [])
            .map((e) => `## ${e.title}\n${e.content}`)
            .join("\n\n---\n\n");

        return NextResponse.json({
            found: (allData?.length || 0) > 0,
            count: allData?.length || 0,
            knowledge: formatted || "No knowledge base entries found.",
        });
    } catch (error: any) {
        console.error("Knowledge API error:", error);
        return NextResponse.json(
            {
                found: false,
                count: 0,
                knowledge:
                    "Knowledge base temporarily unavailable. Please answer from your general knowledge about Superior University, Lahore.",
            },
            { status: 500 }
        );
    }
}

// Also support GET for testing
export async function GET() {
    const { data, error } = await supabase
        .from("knowledge_base")
        .select("id, title, category, is_active, created_at")
        .eq("client_id", "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        .eq("is_active", true)
        .order("category", { ascending: true });

    return NextResponse.json({
        total: data?.length || 0,
        entries: data || [],
        error: error?.message || null,
    });
}
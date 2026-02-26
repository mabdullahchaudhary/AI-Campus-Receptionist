import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

interface KnowledgeSearchParams {
    query: string;
    clientId?: string;
    category?: string;
    limit?: number;
}

export async function searchKnowledgeMarkdown(params: KnowledgeSearchParams) {
    const clientId = params.clientId || DEFAULT_CLIENT_ID;
    const limit = params.limit ?? 5;

    try {
        let dbQuery = supabase
            .from("knowledge_base")
            .select("title, content")
            .eq("client_id", clientId)
            .eq("is_active", true);

        if (params.category) {
            dbQuery = dbQuery.eq("category", params.category);
        }

        if (params.query) {
            const keywords = params.query
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .split(/\s+/)
                .filter((w) => w.length > 2)
                .slice(0, 5);

            if (keywords.length > 0) {
                const conditions = keywords.map((k) => `title.ilike.%${k}%,content.ilike.%${k}%`).join(",");
                dbQuery = dbQuery.or(conditions);
            }
        }

        const { data } = await dbQuery.limit(limit);

        if (data && data.length > 0) {
            return data.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");
        }

        const { data: fallback } = await supabase
            .from("knowledge_base")
            .select("title, content")
            .eq("client_id", clientId)
            .eq("is_active", true)
            .eq("category", params.category || "general")
            .limit(3);

        if (fallback && fallback.length > 0) {
            return fallback.map((e) => `## ${e.title}\n${e.content}`).join("\n\n---\n\n");
        }

        return "No information found.";
    } catch {
        return "Knowledge base temporarily unavailable.";
    }
}

interface RawKnowledgeSearchParams {
    query?: string;
    clientId?: string;
    category?: string;
    limit?: number;
}

export async function searchKnowledgeRaw(params: RawKnowledgeSearchParams) {
    const clientId = params.clientId || DEFAULT_CLIENT_ID;
    const limit = params.limit ?? 10;

    let dbQuery = supabase
        .from("knowledge_base")
        .select("title, content, category, content_type")
        .eq("client_id", clientId)
        .eq("is_active", true);

    if (params.category) {
        dbQuery = dbQuery.eq("category", params.category);
    }

    if (params.query) {
        const keywords = params.query
            .toLowerCase()
            .split(/\s+/)
            .filter((w) => w.length > 2);

        if (keywords.length > 0) {
            const orConditions = keywords
                .map((k) => `title.ilike.%${k}%,content.ilike.%${k}%`)
                .join(",");
            dbQuery = dbQuery.or(orConditions);
        }
    }

    const { data, error } = await dbQuery.limit(limit);
    if (error) throw error;

    return {
        results: data || [],
        count: data?.length || 0,
    };
}


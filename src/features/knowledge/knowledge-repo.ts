import { supabase } from "@/lib/supabase";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export interface KnowledgeEntry {
    id: string;
    client_id: string;
    title: string;
    content: string;
    content_type: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface KnowledgeQueryParams {
    clientId?: string;
    category?: string | null;
    search?: string | null;
}

export async function getKnowledgeEntries(params: KnowledgeQueryParams) {
    const clientId = params.clientId || DEFAULT_CLIENT_ID;

    let query = supabase
        .from("knowledge_base")
        .select("*")
        .eq("client_id", clientId)
        .order("category")
        .order("created_at", { ascending: false });

    if (params.category && params.category !== "all") {
        query = query.eq("category", params.category);
    }

    if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as KnowledgeEntry[];
}

interface CreateKnowledgeInput {
    title: string;
    content: string;
    content_type?: string;
    category?: string;
    created_by: string;
    clientId?: string;
}

export async function createKnowledgeEntry(input: CreateKnowledgeInput) {
    const clientId = input.clientId || DEFAULT_CLIENT_ID;

    const { data, error } = await supabase
        .from("knowledge_base")
        .insert({
            client_id: clientId,
            title: input.title,
            content: input.content,
            content_type: input.content_type || "text",
            category: input.category || "general",
            created_by: input.created_by,
        })
        .select()
        .single();

    if (error) throw error;
    return data as KnowledgeEntry;
}

interface UpdateKnowledgeInput {
    id: string;
    title?: string;
    content?: string;
    content_type?: string;
    category?: string;
    is_active?: boolean;
    clientId?: string;
}

export async function updateKnowledgeEntry(input: UpdateKnowledgeInput) {
    const clientId = input.clientId || DEFAULT_CLIENT_ID;

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.title !== undefined) updates.title = input.title;
    if (input.content !== undefined) updates.content = input.content;
    if (input.content_type !== undefined) updates.content_type = input.content_type;
    if (input.category !== undefined) updates.category = input.category;
    if (input.is_active !== undefined) updates.is_active = input.is_active;

    const { data, error } = await supabase
        .from("knowledge_base")
        .update(updates)
        .eq("id", input.id)
        .eq("client_id", clientId)
        .select()
        .single();

    if (error) throw error;
    return data as KnowledgeEntry;
}

export async function deleteKnowledgeEntry(id: string, clientId?: string) {
    const resolvedClientId = clientId || DEFAULT_CLIENT_ID;

    const { error } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("id", id)
        .eq("client_id", resolvedClientId);

    if (error) throw error;
}


import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

const CLIENT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

// GET — Fetch all knowledge base entries
export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        let query = supabase
            .from("knowledge_base")
            .select("*")
            .eq("client_id", CLIENT_ID)
            .order("category", { ascending: true })
            .order("created_at", { ascending: false });

        if (category && category !== "all") {
            query = query.eq("category", category);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ entries: data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — Create new entry
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, content, content_type, category } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("knowledge_base")
            .insert({
                client_id: CLIENT_ID,
                title,
                content,
                content_type: content_type || "text",
                category: category || "general",
                created_by: session.user.id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ entry: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT — Update entry
export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, title, content, content_type, category, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (title !== undefined) updates.title = title;
        if (content !== undefined) updates.content = content;
        if (content_type !== undefined) updates.content_type = content_type;
        if (category !== undefined) updates.category = category;
        if (is_active !== undefined) updates.is_active = is_active;

        const { data, error } = await supabase
            .from("knowledge_base")
            .update(updates)
            .eq("id", id)
            .eq("client_id", CLIENT_ID)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ entry: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — Remove entry
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("knowledge_base")
            .delete()
            .eq("id", id)
            .eq("client_id", CLIENT_ID);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
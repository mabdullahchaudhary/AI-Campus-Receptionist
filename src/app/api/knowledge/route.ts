import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        let query = supabase.from("knowledge_base").select("*").eq("client_id", DEFAULT_CLIENT_ID).order("category").order("created_at", { ascending: false });

        if (category && category !== "all") query = query.eq("category", category);
        if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ entries: data || [] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        if (!body.title || !body.content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

        const { data, error } = await supabase.from("knowledge_base").insert({
            client_id: DEFAULT_CLIENT_ID,
            title: body.title,
            content: body.content,
            content_type: body.content_type || "text",
            category: body.category || "general",
            created_by: session.user.id,
        }).select().single();

        if (error) throw error;
        return NextResponse.json({ entry: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (body.title !== undefined) updates.title = body.title;
        if (body.content !== undefined) updates.content = body.content;
        if (body.content_type !== undefined) updates.content_type = body.content_type;
        if (body.category !== undefined) updates.category = body.category;
        if (body.is_active !== undefined) updates.is_active = body.is_active;

        const { data, error } = await supabase.from("knowledge_base").update(updates).eq("id", body.id).eq("client_id", DEFAULT_CLIENT_ID).select().single();
        if (error) throw error;
        return NextResponse.json({ entry: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const { error } = await supabase.from("knowledge_base").delete().eq("id", id).eq("client_id", DEFAULT_CLIENT_ID);
        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
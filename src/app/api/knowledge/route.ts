import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
    getKnowledgeEntries,
    createKnowledgeEntry,
    updateKnowledgeEntry,
    deleteKnowledgeEntry,
} from "@/features/knowledge/knowledge-repo";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        const entries = await getKnowledgeEntries({
            category,
            search,
        });

        return NextResponse.json({ entries });
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

        const entry = await createKnowledgeEntry({
            title: body.title,
            content: body.content,
            content_type: body.content_type,
            category: body.category,
            created_by: session.user.id,
        });

        return NextResponse.json({ entry });
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

        const entry = await updateKnowledgeEntry({
            id: body.id,
            title: body.title,
            content: body.content,
            content_type: body.content_type,
            category: body.category,
            is_active: body.is_active,
        });

        return NextResponse.json({ entry });
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

        await deleteKnowledgeEntry(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
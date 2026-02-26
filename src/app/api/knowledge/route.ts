import { NextRequest, NextResponse } from "next/server";
import { errorRedirect } from "@/lib/error-redirect";
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
        if (!session?.user) return errorRedirect(req, 401, "Unauthorized");

        const url = new URL(req.url);
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        const entries = await getKnowledgeEntries({
            category,
            search,
        });

        return NextResponse.json({ entries });
    } catch (error: any) {
        return errorRedirect(req, 500, error.message);
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return errorRedirect(req, 401, "Unauthorized");

        const body = await req.json();
        if (!body.title || !body.content) return errorRedirect(req, 400, "Title and content required");

        const entry = await createKnowledgeEntry({
            title: body.title,
            content: body.content,
            content_type: body.content_type,
            category: body.category,
            created_by: session.user.id,
        });

        return NextResponse.json({ entry });
    } catch (error: any) {
        return errorRedirect(req, 500, error.message);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return errorRedirect(req, 401, "Unauthorized");

        const body = await req.json();
        if (!body.id) return errorRedirect(req, 400, "ID required");

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
        return errorRedirect(req, 500, error.message);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) return errorRedirect(req, 401, "Unauthorized");

        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id) return errorRedirect(req, 400, "ID required");

        await deleteKnowledgeEntry(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return errorRedirect(req, 500, error.message);
    }
}
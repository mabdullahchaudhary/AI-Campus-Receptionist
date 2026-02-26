import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeRaw } from "@/features/knowledge/knowledge-search";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, client_id, category } = body;

        const { results, count } = await searchKnowledgeRaw({
            query,
            clientId: client_id,
            category,
            limit: 10,
        });

        return NextResponse.json({
            results,
            count,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
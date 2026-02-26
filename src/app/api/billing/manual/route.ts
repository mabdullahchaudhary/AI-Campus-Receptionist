import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createTransaction } from "@/features/billing/billing-repo";

const PRO_AMOUNT = 29;

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let body: { transactionId?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const transactionId = (body.transactionId ?? "").trim();
    if (!transactionId) {
        return NextResponse.json({ error: "transactionId is required" }, { status: 400 });
    }
    try {
        await createTransaction({
            user_id: session.user.id,
            amount: PRO_AMOUNT,
            method: "manual",
            status: "pending",
            transaction_id: transactionId,
        });
        return NextResponse.json({ success: true });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Submission failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

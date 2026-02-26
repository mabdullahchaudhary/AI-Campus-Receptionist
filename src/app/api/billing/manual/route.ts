import { NextRequest, NextResponse } from "next/server";
import { errorRedirect } from "@/lib/error-redirect";
import { auth } from "@/lib/auth";
import { createTransaction } from "@/features/billing/billing-repo";

const PRO_AMOUNT = 29;

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return errorRedirect(req, 401, "Unauthorized");
    }
    let body: { transactionId?: string };
    try {
        body = await req.json();
    } catch {
        return errorRedirect(req, 400, "Invalid body");
    }
    const transactionId = (body.transactionId ?? "").trim();
    if (!transactionId) {
        return errorRedirect(req, 400, "transactionId is required");
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
        return errorRedirect(req, 500, message);
    }
}

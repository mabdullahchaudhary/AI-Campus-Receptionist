import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/features/auth/admin/token";
import { getTransactionById, updateTransactionStatus, updateUserPlan } from "@/features/billing/billing-repo";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    const token = (await cookies()).get("admin_token")?.value;
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: { id: string; action: "approve" | "reject" };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    const { id, action } = body;
    if (!id || !action || (action !== "approve" && action !== "reject")) {
        return NextResponse.json({ error: "id and action (approve|reject) required" }, { status: 400 });
    }

    const transaction = await getTransactionById(id);
    if (transaction.method !== "manual" || transaction.status !== "pending") {
        return NextResponse.json({ error: "Transaction not found or not pending" }, { status: 400 });
    }

    if (action === "approve") {
        await updateUserPlan(transaction.user_id, "pro");
        await updateTransactionStatus(transaction.id, "completed");
    } else {
        await updateTransactionStatus(transaction.id, "failed");
    }
    return NextResponse.json({ success: true });
}

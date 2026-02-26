import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/features/auth/admin/token";
import { getPendingManualTransactions } from "@/features/billing/billing-repo";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";

export async function GET() {
    const token = (await cookies()).get("admin_token")?.value;
    const admin = verifyAdminToken(token);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const transactions = await getPendingManualTransactions();
    if (transactions.length === 0) {
        return NextResponse.json({ pending: [], users: {} });
    }
    const userIds = [...new Set(transactions.map((t) => t.user_id))];
    const { data: users } = await supabase
        .from("platform_users")
        .select("id, email, full_name")
        .in("id", userIds);
    const userMap: Record<string, { email: string; full_name: string }> = {};
    (users || []).forEach((u: { id: string; email: string; full_name: string }) => {
        userMap[u.id] = { email: u.email, full_name: u.full_name };
    });
    const pending = transactions.map((t) => ({
        id: t.id,
        user_id: t.user_id,
        amount: t.amount,
        transaction_id: t.transaction_id,
        created_at: t.created_at,
        email: userMap[t.user_id]?.email ?? "",
        full_name: userMap[t.user_id]?.full_name ?? "",
    }));
    return NextResponse.json({ pending, users: userMap });
}

import { supabase } from "@/lib/supabase";

export type TransactionMethod = "stripe" | "manual" | "admin_override";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
    id: string;
    user_id: string;
    amount: number;
    method: TransactionMethod;
    status: TransactionStatus;
    transaction_id: string | null;
    created_at: string;
    updated_at: string | null;
}

export interface CreateTransactionInput {
    user_id: string;
    amount: number;
    method: TransactionMethod;
    status: TransactionStatus;
    transaction_id?: string | null;
}

export async function createTransaction(input: CreateTransactionInput) {
    const { data, error } = await supabase
        .from("transactions")
        .insert({
            user_id: input.user_id,
            amount: input.amount,
            method: input.method,
            status: input.status,
            transaction_id: input.transaction_id ?? null,
        })
        .select()
        .single();
    if (error) throw error;
    return data as Transaction;
}

export async function getTransactionById(id: string) {
    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();
    if (error) throw error;
    return data as Transaction;
}

export async function getPendingManualTransactions() {
    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("method", "manual")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as Transaction[];
}

export async function updateTransactionStatus(id: string, status: TransactionStatus) {
    const { data, error } = await supabase
        .from("transactions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data as Transaction;
}

export type PlanTier = "free" | "pro" | "enterprise";

export async function updateUserPlan(userId: string, plan: PlanTier) {
    const { data, error } = await supabase
        .from("platform_users")
        .update({ plan })
        .eq("id", userId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function getUserById(userId: string) {
    const { data, error } = await supabase
        .from("platform_users")
        .select("id, email, full_name, plan")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
}

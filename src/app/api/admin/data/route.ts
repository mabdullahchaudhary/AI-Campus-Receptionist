import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyAdminToken } from "@/features/auth/admin/token";

export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req.cookies.get("admin_token")?.value);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const section = url.searchParams.get("section");

  try {
    switch (section) {
      case "overview": {
        const [usersRes, callsRes, appointmentsRes, knowledgeRes] = await Promise.all([
          supabase.from("platform_users").select("id, plan, created_at", { count: "exact" }),
          supabase.from("call_logs").select("id, duration_seconds, status, created_at", { count: "exact" }),
          supabase.from("appointments").select("id, status", { count: "exact" }),
          supabase.from("knowledge_base").select("id", { count: "exact" }).eq("is_active", true),
        ]);

        const users = usersRes.data || [];
        const calls = callsRes.data || [];
        const freeUsers = users.filter((u) => u.plan === "free").length;
        const proUsers = users.filter((u) => u.plan === "pro").length;
        const totalCallMinutes = calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60;
        const todayCalls = calls.filter((c) => new Date(c.created_at).toDateString() === new Date().toDateString()).length;

        return NextResponse.json({
          totalUsers: users.length,
          freeUsers,
          proUsers,
          enterpriseUsers: users.filter((u) => u.plan === "enterprise").length,
          totalCalls: calls.length,
          todayCalls,
          totalCallMinutes: Math.round(totalCallMinutes * 10) / 10,
          totalAppointments: appointmentsRes.count || 0,
          activeKnowledge: knowledgeRes.count || 0,
        });
      }

      case "users": {
        const { data } = await supabase
          .from("platform_users")
          .select("id, email, full_name, avatar_url, plan, total_calls_made, last_login_at, created_at")
          .order("created_at", { ascending: false });
        return NextResponse.json({ users: data || [] });
      }

      case "calls": {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = 20;
        const offset = (page - 1) * limit;

        const { data, count } = await supabase
          .from("call_logs")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        return NextResponse.json({ calls: data || [], total: count || 0, page, limit });
      }

      case "providers": {
        const { data } = await supabase
          .from("credit_providers")
          .select("*")
          .order("priority", { ascending: true });
        return NextResponse.json({ providers: data || [] });
      }

      case "health": {
        const { data } = await supabase
          .from("system_health_log")
          .select("*")
          .order("checked_at", { ascending: false })
          .limit(50);
        return NextResponse.json({ logs: data || [] });
      }

      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — Admin actions (change plan, block user, etc.)
export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req.cookies.get("admin_token")?.value);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action } = body;

  try {
    switch (action) {
      case "change_plan": {
        const { userId, newPlan } = body;
        const { data, error } = await supabase
          .from("platform_users")
          .update({ plan: newPlan })
          .eq("id", userId)
          .select()
          .single();
        if (error) throw error;
        return NextResponse.json({ success: true, user: data });
      }

      case "block_user": {
        const { userId } = body;
        await supabase.from("platform_users").update({ plan: "free" }).eq("id", userId);
        return NextResponse.json({ success: true });
      }

      case "add_provider": {
        const { provider, account_email, api_key_public, api_key_private, credits_remaining, priority } = body;
        const { data, error } = await supabase.from("credit_providers").insert({
          provider, account_email, api_key_public, api_key_private,
          credits_remaining: credits_remaining || 10,
          priority: priority || 0,
        }).select().single();
        if (error) throw error;
        return NextResponse.json({ success: true, provider: data });
      }

      case "remove_provider": {
        const { providerId } = body;
        await supabase.from("credit_providers").delete().eq("id", providerId);
        return NextResponse.json({ success: true });
      }

      case "update_credits": {
        const { providerId, credits } = body;
        await supabase.from("credit_providers").update({ credits_remaining: credits, last_checked_at: new Date().toISOString() }).eq("id", providerId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
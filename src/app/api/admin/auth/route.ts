import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST — Send OTP or Verify OTP
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp } = body;

    if (action === "send_otp") {
      // Check if admin exists
      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (!admin) {
        return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
      }

      // Generate OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

      // Save OTP
      await supabase
        .from("admin_users")
        .update({ otp_code: otpCode, otp_expires_at: expiresAt })
        .eq("id", admin.id);

      // TODO: Integrate email delivery (Resend/SendGrid) to send otpCode
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Admin OTP for ${email}: ${otpCode}`);
      }

      return NextResponse.json({ success: true, message: "OTP sent to your email" });
    }

    if (action === "verify_otp") {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("otp_code", otp)
        .eq("is_active", true)
        .single();

      if (!admin) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
      }

      // Check expiry
      if (new Date(admin.otp_expires_at) < new Date()) {
        return NextResponse.json({ error: "OTP expired" }, { status: 401 });
      }

      // Clear OTP and update login time
      await supabase
        .from("admin_users")
        .update({ otp_code: null, otp_expires_at: null, last_login_at: new Date().toISOString() })
        .eq("id", admin.id);

      // Create a simple admin token (in production use proper JWT)
      const token = Buffer.from(
        JSON.stringify({ id: admin.id, email: admin.email, name: admin.name, exp: Date.now() + 24 * 60 * 60 * 1000 })
      ).toString("base64");

      const response = NextResponse.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } });

      // Set admin cookie
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
      });

      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import AdminOtpEmail from "@/components/email/AdminOtpEmail";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, otp } = body;

    if (action === "send_otp") {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      if (!admin) {
        return NextResponse.json({ error: "Not authorized as admin" }, { status: 403 });
      }

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await supabase
        .from("admin_users")
        .update({ otp_code: otpCode, otp_expires_at: expiresAt })
        .eq("id", admin.id);

      await sendEmail({
        to: email,
        subject: "Your Superior AI admin login code",
        react: AdminOtpEmail({ otpCode }),
      });

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

      if (new Date(admin.otp_expires_at) < new Date()) {
        return NextResponse.json({ error: "OTP expired" }, { status: 401 });
      }

      await supabase
        .from("admin_users")
        .update({ otp_code: null, otp_expires_at: null, last_login_at: new Date().toISOString() })
        .eq("id", admin.id);

      const token = Buffer.from(
        JSON.stringify({ id: admin.id, email: admin.email, name: admin.name, exp: Date.now() + 24 * 60 * 60 * 1000 })
      ).toString("base64");

      const response = NextResponse.json({ success: true, admin: { id: admin.id, name: admin.name, email: admin.email } });

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
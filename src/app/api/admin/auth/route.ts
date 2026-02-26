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
      const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      if (!trimmedEmail) {
        return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
      }
      const { data: admin, error: fetchError } = await supabase
        .from("platform_users")
        .select("id, email, full_name")
        .eq("email", trimmedEmail)
        .eq("is_admin", true)
        .single();

      if (fetchError || !admin) {
        return NextResponse.json({ success: false, error: "Not authorized as admin" }, { status: 403 });
      }

      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: updateError } = await supabase
        .from("platform_users")
        .update({ otp_code: otpCode, otp_expires_at: expiresAt })
        .eq("id", admin.id);

      if (updateError) {
        return NextResponse.json({ success: false, error: "Could not save OTP" }, { status: 500 });
      }

      try {
        await sendEmail({
          to: trimmedEmail,
          subject: "Your Superior AI admin login code",
          react: AdminOtpEmail({ otpCode }),
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to send email";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "OTP sent to your email" });
    }

    if (action === "verify_otp") {
      const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
      const trimmedOtp = typeof otp === "string" ? otp.trim() : "";
      if (!trimmedEmail || !trimmedOtp) {
        return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
      }
      const { data: admin, error: fetchError } = await supabase
        .from("platform_users")
        .select("id, email, full_name, otp_code, otp_expires_at")
        .eq("email", trimmedEmail)
        .eq("is_admin", true)
        .single();

      if (fetchError || !admin) {
        return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });
      }

      if (admin.otp_code !== trimmedOtp) {
        return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });
      }

      if (!admin.otp_expires_at || new Date(admin.otp_expires_at) < new Date()) {
        return NextResponse.json({ success: false, error: "OTP expired" }, { status: 401 });
      }

      const { error: clearError } = await supabase
        .from("platform_users")
        .update({ otp_code: null, otp_expires_at: null, last_login_at: new Date().toISOString() })
        .eq("id", admin.id);

      if (clearError) {
        return NextResponse.json({ success: false, error: "Could not complete login" }, { status: 500 });
      }

      const token = Buffer.from(
        JSON.stringify({
          id: admin.id,
          email: admin.email,
          name: admin.full_name ?? admin.email,
          exp: Date.now() + 24 * 60 * 60 * 1000,
        })
      ).toString("base64");

      const response = NextResponse.json({
        success: true,
        admin: { id: admin.id, name: admin.full_name, email: admin.email },
      });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60,
        path: "/",
      });
      return response;
    }

    if (action === "logout") {
      const response = NextResponse.json({ success: true });
      response.cookies.delete("admin_token");
      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

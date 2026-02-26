"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Key, Loader2, ArrowRight, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email }),
      });
      const data = await res.json().catch(() => ({ success: false, error: "Invalid response" }));
      if (data.success) {
        setStep("otp");
        if (data.dev_otp) setDevOtp(data.dev_otp);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_otp", email, otp }),
      });
      const data = await res.json().catch(() => ({ success: false, error: "Invalid response" }));
      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-violet-50 p-6">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/20">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Superior AI — Control Center</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
          {step === "email" ? (
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-violet-600" />
              </div>
              <div className="text-center">
                <h2 className="font-heading font-bold text-lg">Enter Admin Email</h2>
                <p className="text-sm text-muted-foreground mt-1">We&apos;ll send a one-time password</p>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
              />
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSendOTP}
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm disabled:opacity-50 shadow-lg shadow-violet-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-center">
                <h2 className="font-heading font-bold text-lg">Enter OTP</h2>
                <p className="text-sm text-muted-foreground mt-1">Sent to {email}</p>
              </div>
              {devOtp && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <p className="text-xs text-amber-600">DEV MODE — Your OTP:</p>
                  <p className="text-2xl font-mono font-bold text-amber-700 tracking-widest mt-1">{devOtp}</p>
                </div>
              )}
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-gray-50 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
              />
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm disabled:opacity-50 shadow-lg shadow-emerald-500/20"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /><span>Verify & Login</span></>}
              </motion.button>
              <button
                onClick={() => {
                  setStep("email");
                  setError("");
                  setDevOtp("");
                }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to email
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


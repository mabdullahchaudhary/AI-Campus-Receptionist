"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mic, ArrowLeft, Shield, Zap, Globe, Check, Phone, Brain, BookOpen, Users, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen bg-white flex">

            {/* ========== LEFT PANEL ========== */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">

                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/login-bg.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />

                {/* Multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-violet-950/90 to-indigo-950/95" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40" />

                {/* Animated gradient orbs */}
                <div className="absolute top-[15%] left-[10%] w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "4s" }} />
                <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-indigo-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "6s" }} />
                <div className="absolute top-[60%] left-[40%] w-[200px] h-[200px] bg-violet-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: "5s" }} />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">

                    {/* Top Row — Logo + Back */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 group-hover:scale-105 transition-all duration-300">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[18px] font-heading font-extrabold text-white tracking-tight">
                                Superior<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400"> AI</span>
                            </span>
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.08] text-white/70 text-[13px] font-medium hover:bg-white/[0.12] hover:text-white backdrop-blur-sm transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Center — Main Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/20 mb-6 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[12px] font-semibold text-violet-300">Riley is Active 24/7</span>
                        </div>

                        <h1 className="text-[38px] xl:text-[48px] font-heading font-extrabold text-white leading-[1.1] tracking-tight">
                            One Sign-in Away
                            <br />from Your Own
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-300">
                                AI Receptionist
                            </span>
                        </h1>

                        <p className="text-white/40 text-[15px] mt-5 max-w-md leading-relaxed">
                            Manage Riley, train with your university data, view call analytics, and let AI handle admissions, fees, and scholarships all from one dashboard.
                        </p>

                        {/* Floating tool cards */}
                        <div className="grid grid-cols-3 gap-3 mt-10 max-w-lg">
                            {[
                                { icon: Phone, label: "Voice Calls", desc: "Real-time AI calls", color: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/20" },
                                { icon: Brain, label: "16 AI Tools", desc: "Auto-activated", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20" },
                                { icon: Globe, label: "3 Languages", desc: "EN • UR • Mix", color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/20" },
                                { icon: Users, label: "Contact CRM", desc: "Auto-saved", color: "from-pink-500/20 to-pink-600/10", border: "border-pink-500/20" },
                                { icon: BarChart3, label: "Analytics", desc: "Real-time data", color: "from-cyan-500/20 to-cyan-600/10", border: "border-cyan-500/20" },
                                { icon: Calendar, label: "Appointments", desc: "Auto-booked", color: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/20" },
                            ].map((card) => (
                                <div
                                    key={card.label}
                                    className={`p-3 rounded-xl bg-gradient-to-br ${card.color} border ${card.border} backdrop-blur-sm hover:scale-[1.04] transition-transform duration-300 cursor-default`}
                                >
                                    <card.icon className="w-4 h-4 text-white/70 mb-2" />
                                    <p className="text-[12px] font-semibold text-white/90 leading-tight">{card.label}</p>
                                    <p className="text-[10px] text-white/35 mt-0.5">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom — Stats + Quote */}
                    <div className="space-y-5">
                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            {[
                                { value: "50+", label: "Features" },
                                { value: "16", label: "AI Tools" },
                                { value: "24/7", label: "Online" },
                                { value: "<1s", label: "Response" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <p className="text-[22px] font-heading font-extrabold text-white">{s.value}</p>
                                    <p className="text-[10px] text-white/30 font-medium uppercase tracking-wider">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm">
                            <div className="flex -space-x-2 shrink-0">
                                {["A", "H", "A", "A", "M", "Z"].map((letter, i) => (
                                    <div
                                        key={i}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-gray-900 ${["bg-violet-600", "bg-blue-600", "bg-pink-600", "bg-emerald-600", "bg-amber-600", "bg-red-500"][i]
                                            }`}
                                    >
                                        {letter}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-white/60 text-[12px] leading-relaxed">
                                    Built by <span className="text-white/90 font-semibold">6 students</span> from Superior University proving AI can make education accessible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== RIGHT PANEL — SAME ========== */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-16">
                <div className="w-full max-w-[400px]">

                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                    <Mic className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[16px] font-heading font-extrabold text-gray-900">
                                    Superior<span className="text-violet-600"> AI</span>
                                </span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gray-50 text-gray-500 text-[12px] font-medium hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Home
                            </Link>
                        </div>
                    </div>

                    {/* Welcome */}
                    <div>
                        <h2 className="text-[26px] sm:text-[30px] font-heading font-extrabold text-gray-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="text-[15px] text-gray-500 mt-2">
                            Sign in with Google to access your dashboard and start managing Riley.
                        </p>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-800 font-semibold text-[15px] hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg hover:shadow-gray-200/50 active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-violet-600 rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {isLoading ? "Signing in..." : "Continue with Google"}
                    </button>

                    {/* Security note */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-400">Secured with Google OAuth 2.0</span>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[11px] text-gray-400 font-medium">What you get</span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Plans */}
                    <div className="mt-6 space-y-3">
                        {[
                            {
                                name: "Free",
                                tag: "Current",
                                tagColor: "bg-emerald-50 text-emerald-700",
                                features: ["1 call/day", "2-min limit", "All 16 tools", "3 languages"],
                            },
                            {
                                name: "Pro — $29/mo",
                                tag: "Popular",
                                tagColor: "bg-violet-50 text-violet-700",
                                features: ["Unlimited calls", "Full CRM", "BYOK", "Analytics"],
                            },
                            {
                                name: "Enterprise — $99/mo",
                                tag: "Custom",
                                tagColor: "bg-amber-50 text-amber-700",
                                features: ["Phone numbers", "White-label", "API access", "SLA 99.9%"],
                            },
                        ].map((plan) => (
                            <div
                                key={plan.name}
                                className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all duration-300 group cursor-default"
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[14px] font-heading font-bold text-gray-800">{plan.name}</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${plan.tagColor}`}>{plan.tag}</span>
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {plan.features.map((f) => (
                                        <span key={f} className="flex items-center gap-1 text-[11px] text-gray-500">
                                            <Check className="w-3 h-3 text-violet-500" /> {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Terms */}
                    <p className="mt-8 text-[11px] text-gray-400 text-center leading-relaxed">
                        By signing in you agree to our{" "}
                        <a href="#" className="text-violet-600 hover:underline">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="text-violet-600 hover:underline">Privacy Policy</a>.
                        <br />Your data is encrypted and never shared.
                    </p>
                </div>
            </div>
        </div>
    );
}
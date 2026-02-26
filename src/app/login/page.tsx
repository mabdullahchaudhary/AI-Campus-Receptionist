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
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 text-white flex-col justify-between p-10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.12),transparent_60%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.18),transparent_55%),radial-gradient(circle_at_0_80%,rgba(255,255,255,0.1),transparent_55%)]" />
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-violet-100 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to site
                    </Link>
                    <div className="mt-10 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg shadow-black/20">
                            <Mic className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-violet-100">Superior AI</p>
                            <p className="text-lg font-heading font-bold">AI Voice Receptionist</p>
                        </div>
                    </div>
                    <h1 className="mt-10 text-3xl xl:text-4xl font-heading font-extrabold tracking-tight leading-tight">
                        Log in to your AI receptionist dashboard
                    </h1>
                    <p className="mt-4 text-sm text-violet-100/90 max-w-md">
                        Manage calls, knowledge base, appointments, and analytics for your university or business, powered by real-time AI voice.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
                        {[
                            { icon: Phone, label: "24/7 inbound calls", value: "Always on" },
                            { icon: Brain, label: "Groq LLM", value: "Ultra-fast" },
                            { icon: Calendar, label: "Appointments", value: "Auto-scheduled" },
                            { icon: Shield, label: "Security", value: "6-layer stack" },
                        ].map((item) => (
                            <div key={item.label} className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 flex items-start gap-3 backdrop-blur-md">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                    <item.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-violet-100/80">{item.label}</p>
                                    <p className="text-sm font-semibold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative z-10 grid grid-cols-3 gap-4 text-xs">
                    <div className="bg-black/20 rounded-2xl px-4 py-3 border border-white/10">
                        <p className="text-violet-100/80">Average response</p>
                        <p className="mt-1 text-2xl font-heading font-bold">0.8s</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl px-4 py-3 border border-white/10">
                        <p className="text-violet-100/80">Languages</p>
                        <p className="mt-1 text-2xl font-heading font-bold">3+</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl px-4 py-3 border border-white/10">
                        <p className="text-violet-100/80">Daily calls</p>
                        <p className="mt-1 text-2xl font-heading font-bold">10k+</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
                <div className="w-full max-w-md">
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                                <Mic className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-heading font-bold text-sm">Superior AI</span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">Welcome back</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in with your university Google account to access your AI receptionist dashboard.
                        </p>
                    </div>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:shadow-md hover:border-violet-200 transition-all disabled:opacity-70"
                    >
                        {isLoading ? (
                            <span>Redirecting to Google...</span>
                        ) : (
                            <>
                                <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-white shadow">
                                    <span className="text-xs font-bold text-gray-700">G</span>
                                </span>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>
                    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>SSO-only access. No passwords to remember.</span>
                    </div>
                    <div className="mt-10 grid grid-cols-2 gap-4 text-xs">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                <Users className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-semibold">For admissions & call teams</p>
                                <p className="text-muted-foreground mt-1">See live transcripts, call summaries, and FAQs.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-semibold">For leadership</p>
                                <p className="text-muted-foreground mt-1">Monitor usage, satisfaction, and routing quality.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-between text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-violet-500" />
                            <span>Powered by Groq, Vapi, Deepgram, and Supabase</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/legal/privacy" className="hover:text-foreground">
                                Privacy
                            </Link>
                            <Link href="/legal/terms" className="hover:text-foreground">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


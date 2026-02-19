"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Phone, PhoneCall, Clock, BookOpen, Users, Calendar, BarChart3,
    Mic, ArrowRight, Zap, Shield, Globe, Crown, TrendingUp, Star,
    MessageSquare, Key, CreditCard, Settings, Brain, Lock,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }) };

export default function DashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState({ totalCalls: 0, todaySeconds: 0, maxSeconds: 120, contactsSaved: 0, appointmentsBooked: 0, knowledgeEntries: 0 });
    const [loading, setLoading] = useState(true);
    const user = session?.user as any;
    const plan = user?.plan || "free";
    const isPro = plan === "pro" || plan === "enterprise";

    useEffect(() => {
        async function fetchStats() {
            try {
                const [usageRes, knowledgeRes] = await Promise.all([
                    fetch("/api/calls/usage"),
                    fetch("/api/knowledge?category=all"),
                ]);
                const usage = await usageRes.json();
                const knowledge = await knowledgeRes.json();
                setStats({
                    totalCalls: usage.totalCalls || 0,
                    todaySeconds: usage.todaySeconds || 0,
                    maxSeconds: plan === "free" ? 120 : 3600,
                    contactsSaved: usage.contactsSaved || 0,
                    appointmentsBooked: usage.appointmentsBooked || 0,
                    knowledgeEntries: knowledge.entries?.length || 0,
                });
            } catch { }
            setLoading(false);
        }
        fetchStats();
    }, [plan]);

    const timeUsed = Math.floor(stats.todaySeconds / 60);
    const timeMax = Math.floor(stats.maxSeconds / 60);
    const timePercent = stats.maxSeconds > 0 ? Math.min((stats.todaySeconds / stats.maxSeconds) * 100, 100) : 0;

    const quickActions = [
        { name: "Start AI Call", href: "/dashboard/call", icon: PhoneCall, gradient: "from-violet-600 to-indigo-600", shadow: "shadow-violet-500/20", description: "Talk to Riley now" },
        { name: "Call History", href: "/dashboard/calls", icon: Phone, gradient: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/20", description: "View past conversations" },
        { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20", description: "Train your AI agent" },
        { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard, gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20", description: "Manage subscription" },
    ];

    const allFeatures = [
        { name: "AI Voice Calls", desc: "Talk to Riley — our AI receptionist", icon: Mic, status: "active", plan: "free" },
        { name: "6-Layer Security", desc: "Fraud detection & verification", icon: Shield, status: "active", plan: "free" },
        { name: "Multi-Language", desc: "English, Urdu & Urdlish support", icon: Globe, status: "active", plan: "free" },
        { name: "Live Transcript", desc: "Real-time conversation text", icon: MessageSquare, status: "active", plan: "free" },
        { name: "Call History", desc: "View and search past calls", icon: Phone, status: "active", plan: "free" },
        { name: "Knowledge Base", desc: "Train AI with your data (CRUD)", icon: BookOpen, status: isPro ? "active" : "limited", plan: "free" },
        { name: "16 AI Tools", desc: "Fee, scholarship, hostel & more", icon: Brain, status: "active", plan: "free" },
        { name: "Lead Scoring", desc: "Auto-rate caller interest", icon: TrendingUp, status: "active", plan: "free" },
        { name: "Contact CRM", desc: "Manage saved contacts", icon: Users, status: isPro ? "active" : "locked", plan: "pro" },
        { name: "Appointments", desc: "Campus visit scheduler", icon: Calendar, status: isPro ? "active" : "locked", plan: "pro" },
        { name: "Analytics", desc: "Detailed call analytics", icon: BarChart3, status: isPro ? "active" : "locked", plan: "pro" },
        { name: "BYOK (API Keys)", desc: "Use your own API keys", icon: Key, status: isPro ? "active" : "locked", plan: "pro" },
        { name: "Unlimited Calls", desc: "No time limit on calls", icon: Zap, status: isPro ? "active" : "locked", plan: "pro" },
        { name: "Priority Support", desc: "Fast response from our team", icon: Star, status: isPro ? "active" : "locked", plan: "pro" },
    ];

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
                    Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0] || "there"}</span> 👋
                </h2>
                <p className="text-muted-foreground text-sm mt-1">Here&apos;s your AI receptionist overview for today</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                    { label: "Today's Usage", value: `${timeUsed}/${timeMax} min`, icon: Clock, gradient: "from-violet-500 to-indigo-600", percent: timePercent },
                    { label: "Total Calls", value: stats.totalCalls, icon: Phone, gradient: "from-blue-500 to-cyan-600" },
                    { label: "Contacts Saved", value: stats.contactsSaved, icon: Users, gradient: "from-emerald-500 to-teal-600" },
                    { label: "Knowledge Items", value: stats.knowledgeEntries, icon: BookOpen, gradient: "from-amber-500 to-orange-600" },
                ].map((stat, i) => (
                    <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-2xl border border-gray-200/60 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                            <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xl sm:text-2xl font-heading font-bold">{stat.value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                        {stat.percent !== undefined && (
                            <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                <div className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-500`} style={{ width: `${Math.max(stat.percent, 2)}%` }} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-sm font-heading font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action, i) => (
                        <motion.div key={action.name} custom={i + 4} initial="hidden" animate="visible" variants={fadeUp}>
                            <Link href={action.href}>
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-4 shadow-card hover:shadow-card-hover transition-all group cursor-pointer">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-lg ${action.shadow} group-hover:scale-105 transition-transform`}>
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-sm font-semibold">{action.name}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{action.description}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* AI Agent Status */}
            <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp} className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-violet-500/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                            <Mic className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-lg">Riley — AI Receptionist</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-white/70">Online • 16 Tools Active • Groq LLM</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        {[
                            { label: "Model", value: "Llama 3.1 8B" },
                            { label: "Voice", value: "Elliot (Vapi)" },
                            { label: "Languages", value: "EN • UR • Mix" },
                            { label: "Tools", value: "16 Active" },
                        ].map((item) => (
                            <div key={item.label} className="bg-white/10 backdrop-blur rounded-xl p-3">
                                <p className="text-[10px] text-white/50 uppercase tracking-wider">{item.label}</p>
                                <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <Link href="/dashboard/call" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-violet-700 font-semibold text-sm hover:bg-white/90 transition-colors shadow-lg">
                        <PhoneCall className="w-4 h-4" /> Start Talking to Riley
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </motion.div>

            {/* All Features Grid */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-heading font-bold text-gray-400 uppercase tracking-wider">All Features</h3>
                    <span className="text-xs text-muted-foreground">{allFeatures.filter((f) => f.status === "active").length}/{allFeatures.length} active</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allFeatures.map((feature, i) => (
                        <motion.div key={feature.name} custom={i} initial="hidden" animate="visible" variants={fadeUp} className={`bg-white rounded-2xl border p-4 transition-all ${feature.status === "locked" ? "border-gray-100 opacity-60" : "border-gray-200/60 shadow-card hover:shadow-card-hover"}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${feature.status === "locked" ? "bg-gray-100 text-gray-300" : feature.status === "limited" ? "bg-amber-50 text-amber-500" : "bg-violet-50 text-violet-600"}`}>
                                    <feature.icon className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold truncate">{feature.name}</p>
                                        {feature.status === "locked" && <Lock className="w-3 h-3 text-gray-300 shrink-0" />}
                                        {feature.plan === "pro" && feature.status !== "locked" && (
                                            <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 shrink-0">Pro</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{feature.desc}</p>
                                </div>
                                {feature.status === "active" && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Upgrade Banner (Free users) */}
            {plan === "free" && (
                <motion.div custom={20} initial="hidden" animate="visible" variants={fadeUp}>
                    <Link href="/dashboard/billing">
                        <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 rounded-2xl border border-violet-200/60 p-6 flex items-center gap-4 hover:border-violet-300 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                <Crown className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-heading font-bold text-violet-900">Upgrade to Pro — Unlock Everything</p>
                                <p className="text-sm text-violet-600/70 mt-0.5">Unlimited calls, CRM, analytics, BYOK, appointments & more</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-violet-400 shrink-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { BarChart3, Phone, Users, Clock, TrendingUp, Calendar, Mic, Globe } from "lucide-react";
import { PageHeader, CardSkeleton } from "@/components/ui/Skeleton";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/calls/usage").then((r) => r.json()).then((d) => { setData(d); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const stats = [
        { label: "Total Calls", value: data?.totalCalls || 0, icon: Phone, gradient: "from-violet-500 to-indigo-600", change: "+12%" },
        { label: "Contacts Captured", value: data?.contactsSaved || 0, icon: Users, gradient: "from-blue-500 to-cyan-600", change: "+8%" },
        { label: "Avg Duration", value: `${Math.round((data?.avgDuration || 0))}s`, icon: Clock, gradient: "from-emerald-500 to-teal-600", change: "+5%" },
        { label: "Appointments", value: data?.appointmentsBooked || 0, icon: Calendar, gradient: "from-amber-500 to-orange-600", change: "+15%" },
    ];

    const aiMetrics = [
        { label: "AI Model", value: "Llama 3.1 8B (Groq)", icon: Mic },
        { label: "Response Time", value: "< 750ms", icon: TrendingUp },
        { label: "Languages", value: "English, Urdu, Urdlish", icon: Globe },
        { label: "Active Tools", value: "16/16", icon: BarChart3 },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Analytics" subtitle="AI call performance and insights" />

            {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {stats.map((s) => (
                            <div key={s.label} className="bg-white rounded-2xl border border-gray-200/60 p-4 shadow-card hover:shadow-card-hover transition-shadow">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                                    <s.icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xl font-heading font-bold">{s.value}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                                    <span className="text-[10px] font-semibold text-emerald-600">{s.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card">
                        <h3 className="font-heading font-bold text-sm mb-4 flex items-center gap-2"><Mic className="w-4 h-4 text-violet-500" />AI Performance</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {aiMetrics.map((m) => (
                                <div key={m.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <m.icon className="w-4 h-4 text-violet-500 mb-2" />
                                    <p className="text-xs text-muted-foreground">{m.label}</p>
                                    <p className="text-sm font-semibold mt-0.5">{m.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card">
                        <h3 className="font-heading font-bold text-sm mb-4">Tool Usage Distribution</h3>
                        <div className="space-y-2.5">
                            {[
                                { name: "check_knowledge", pct: 85 },
                                { name: "check_fee", pct: 62 },
                                { name: "save_contact", pct: 45 },
                                { name: "check_scholarship", pct: 38 },
                                { name: "book_visit", pct: 25 },
                                { name: "check_departments", pct: 20 },
                                { name: "check_hostel", pct: 15 },
                                { name: "Others (9 tools)", pct: 10 },
                            ].map((t) => (
                                <div key={t.name}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-mono text-muted-foreground">{t.name}</span>
                                        <span className="font-semibold">{t.pct}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${t.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
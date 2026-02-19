"use client";

import { useState, useEffect } from "react";
import { Phone, ChevronDown, ChevronUp, MessageSquare, Clock, Eye, Search, Filter } from "lucide-react";
import { PageHeader, ListSkeleton, EmptyState, Badge } from "@/components/ui/Skeleton";

interface Call { id: string; session_id: string; status: string; duration_seconds: number; transcript: string; ai_summary: string; sentiment: string; created_at: string; }

export default function CallsPage() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("/api/calls/usage").then((r) => r.json()).then((d) => { setCalls(d.calls || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const filtered = searchTerm ? calls.filter((c) => c.transcript?.toLowerCase().includes(searchTerm.toLowerCase()) || c.ai_summary?.toLowerCase().includes(searchTerm.toLowerCase()) || c.session_id?.toLowerCase().includes(searchTerm.toLowerCase())) : calls;

    const totalMinutes = Math.round(calls.reduce((s, c) => s + (c.duration_seconds || 0), 0) / 60);

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Call History" subtitle={`${calls.length} calls • ${totalMinutes} total minutes`} />

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total Calls", value: calls.length, color: "text-violet-600" },
                    { label: "Completed", value: calls.filter((c) => c.status === "completed").length, color: "text-emerald-600" },
                    { label: "Total Minutes", value: totalMinutes, color: "text-blue-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-3 text-center shadow-card">
                        <p className={`text-lg font-heading font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search transcripts, summaries..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>

            {/* List */}
            {loading ? <ListSkeleton rows={6} /> : filtered.length === 0 ? (
                <EmptyState icon={Phone} title="No calls yet" subtitle="Start a call with Riley to see your conversation history here" />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-card overflow-hidden divide-y divide-gray-50">
                    {filtered.map((call) => (
                        <div key={call.id}>
                            <div className="px-4 sm:px-5 py-3.5 flex items-center gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpanded(expanded === call.id ? null : call.id)}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${call.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate">{call.ai_summary?.substring(0, 60) || call.session_id?.substring(0, 20) || "Call"}</p>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(call.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-semibold">{call.duration_seconds || 0}s</p>
                                        <Badge variant={call.status === "completed" ? "success" : "default"}>{call.status}</Badge>
                                    </div>
                                    {expanded === call.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                </div>
                            </div>
                            {expanded === call.id && (
                                <div className="px-4 sm:px-5 pb-4 space-y-3">
                                    {call.ai_summary && (
                                        <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-100">
                                            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><MessageSquare className="w-3 h-3" />AI Summary</p>
                                            <p className="text-sm text-violet-900 leading-relaxed">{call.ai_summary}</p>
                                        </div>
                                    )}
                                    {call.transcript ? (
                                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Eye className="w-3 h-3" />Transcript</p>
                                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans max-h-64 overflow-y-auto leading-relaxed">{call.transcript}</pre>
                                        </div>
                                    ) : <p className="text-sm text-muted-foreground italic pl-1">No transcript recorded</p>}
                                    <div className="flex gap-2 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{call.duration_seconds}s</span>
                                        {call.sentiment && <span>• Sentiment: {call.sentiment}</span>}
                                        <span>• ID: {call.session_id?.substring(0, 12)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
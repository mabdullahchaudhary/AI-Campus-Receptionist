"use client";

import { useState, useEffect } from "react";
import { Users, Search, Phone, Mail, Star, Clock } from "lucide-react";
import { PageHeader, ListSkeleton, EmptyState, Badge } from "@/components/ui/Skeleton";
import { DEFAULT_CLIENT_ID } from "@/lib/config";

interface Contact { id: string; full_name: string; phone: string; email: string; lead_score: string; interested_program: string; call_count: number; last_seen_at: string; created_at: string; }

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/contacts").then((r) => r.json()).then((d) => { setContacts(d.contacts || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const filtered = search ? contacts.filter((c) => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase())) : contacts;

    const scoreColors: Record<string, string> = { hot: "bg-red-50 text-red-700", warm: "bg-amber-50 text-amber-700", cold: "bg-blue-50 text-blue-700", unknown: "bg-gray-100 text-gray-500" };

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Contacts" subtitle={`${contacts.length} contacts saved by AI`} />

            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Hot Leads", value: contacts.filter((c) => c.lead_score === "hot").length, color: "text-red-600" },
                    { label: "Warm Leads", value: contacts.filter((c) => c.lead_score === "warm").length, color: "text-amber-600" },
                    { label: "Total", value: contacts.length, color: "text-violet-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-3 text-center shadow-card">
                        <p className={`text-lg font-heading font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
            </div>

            {loading ? <ListSkeleton rows={5} /> : filtered.length === 0 ? (
                <EmptyState icon={Users} title="No contacts yet" subtitle="When callers share their name, AI saves them automatically" />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200/60 shadow-card overflow-hidden divide-y divide-gray-50">
                    {filtered.map((c) => (
                        <div key={c.id} className="px-4 sm:px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50/50 transition-colors">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {c.full_name?.charAt(0) || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{c.full_name}</p>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{c.phone}</span>}
                                    {c.email && <span className="flex items-center gap-1 hidden sm:flex"><Mail className="w-3 h-3" />{c.email}</span>}
                                </div>
                            </div>
                            <div className="text-right shrink-0 hidden sm:block">
                                {c.interested_program && <p className="text-[10px] text-muted-foreground">{c.interested_program}</p>}
                                <p className="text-[10px] text-muted-foreground">{c.call_count || 0} calls</p>
                            </div>
                            <Badge variant={c.lead_score === "hot" ? "error" : c.lead_score === "warm" ? "warning" : "default"}>
                                {c.lead_score || "unknown"}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
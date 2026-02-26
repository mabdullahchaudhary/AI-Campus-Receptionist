"use client";

import { useState, useEffect } from "react";
import { Calendar, User, Clock, MapPin, Phone } from "lucide-react";
import { PageHeader, ListSkeleton, EmptyState, Badge } from "@/components/ui/Skeleton";

interface Appointment { id: string; visitor_name: string; visitor_phone: string; department: string; purpose: string; scheduled_at: string; status: string; created_at: string; }

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/appointments").then((r) => r.json()).then((d) => { setAppointments(d.appointments || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const statusBadge: Record<string, "success" | "warning" | "default" | "error"> = { scheduled: "warning", confirmed: "success", completed: "success", cancelled: "error", no_show: "error" };

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Appointments" subtitle={`${appointments.length} campus visits scheduled by AI`} />

            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Scheduled", value: appointments.filter((a) => a.status === "scheduled").length, color: "text-amber-600" },
                    { label: "Confirmed", value: appointments.filter((a) => a.status === "confirmed").length, color: "text-emerald-600" },
                    { label: "Total", value: appointments.length, color: "text-violet-600" },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200/60 p-3 text-center shadow-card">
                        <p className={`text-lg font-heading font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                ))}
            </div>

            {loading ? <ListSkeleton rows={4} /> : appointments.length === 0 ? (
                <EmptyState icon={Calendar} title="No appointments yet" subtitle="When callers book campus visits, they appear here" />
            ) : (
                <div className="space-y-3">
                    {appointments.map((a) => (
                        <div key={a.id} className="bg-white rounded-2xl border border-gray-200/60 p-4 sm:p-5 shadow-card hover:shadow-card-hover transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-violet-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold">{a.visitor_name}</p>
                                        <Badge variant={statusBadge[a.status] || "default"}>{a.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(a.scheduled_at).toLocaleString()}</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.department}</span>
                                        {a.visitor_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{a.visitor_phone}</span>}
                                    </div>
                                    {a.purpose && <p className="text-xs text-muted-foreground mt-1">Purpose: {a.purpose}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
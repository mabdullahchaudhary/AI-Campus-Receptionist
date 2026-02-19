"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users, Phone, BarChart3, BookOpen, Calendar, Shield, LogOut, Loader2,
    Crown, User, Clock, MessageSquare, Server, Plus, Trash2, RefreshCw,
    ArrowUpDown, Eye, Mic, ChevronDown, ChevronUp,
} from "lucide-react";

interface OverviewData { totalUsers: number; freeUsers: number; proUsers: number; enterpriseUsers: number; totalCalls: number; todayCalls: number; totalCallMinutes: number; totalAppointments: number; activeKnowledge: number; }
interface UserData { id: string; email: string; full_name: string; avatar_url: string; plan: string; total_calls_made: number; last_login_at: string; created_at: string; }
interface CallData { id: string; session_id: string; status: string; duration_seconds: number; transcript: string; ai_summary: string; created_at: string; }
interface ProviderData { id: string; provider: string; account_email: string; api_key_public: string; credits_remaining: number; is_active: boolean; priority: number; }

type Tab = "overview" | "users" | "calls" | "providers";

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [calls, setCalls] = useState<CallData[]>([]);
    const [providers, setProviders] = useState<ProviderData[]>([]);
    const [expandedCall, setExpandedCall] = useState<string | null>(null);
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [newProvider, setNewProvider] = useState({ provider: "vapi", account_email: "", api_key_public: "", api_key_private: "", credits_remaining: 10 });

    const fetchData = useCallback(async (section: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/data?section=${section}`);
            if (res.status === 401) { router.push("/admin/login"); return; }
            const data = await res.json();
            if (section === "overview") setOverview(data);
            if (section === "users") setUsers(data.users || []);
            if (section === "calls") setCalls(data.calls || []);
            if (section === "providers") setProviders(data.providers || []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, [router]);

    useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

    const handleChangePlan = async (userId: string, newPlan: string) => {
        await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "change_plan", userId, newPlan }) });
        fetchData("users");
    };

    const handleAddProvider = async () => {
        await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add_provider", ...newProvider }) });
        setShowAddProvider(false);
        setNewProvider({ provider: "vapi", account_email: "", api_key_public: "", api_key_private: "", credits_remaining: 10 });
        fetchData("providers");
    };

    const handleRemoveProvider = async (id: string) => {
        if (!confirm("Remove this provider account?")) return;
        await fetch("/api/admin/data", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove_provider", providerId: id }) });
        fetchData("providers");
    };

    const handleLogout = async () => {
        await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "logout" }) });
        router.push("/admin/login");
    };

    const tabs = [
        { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
        { id: "users" as Tab, label: "Users", icon: Users },
        { id: "calls" as Tab, label: "Call Logs", icon: Phone },
        { id: "providers" as Tab, label: "Providers", icon: Server },
    ];

    const planColors: Record<string, string> = {
        free: "bg-gray-100 text-gray-600",
        pro: "bg-violet-100 text-violet-700",
        enterprise: "bg-amber-100 text-amber-700",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="font-heading font-bold text-sm">Superior AI</span>
                            <span className="text-[10px] text-violet-600 font-semibold uppercase tracking-wider ml-2 bg-violet-50 px-2 py-0.5 rounded">Admin</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                        <LogOut className="w-4 h-4" />Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "bg-white text-muted-foreground hover:bg-gray-50 border border-gray-200"}`}>
                            <tab.icon className="w-4 h-4" />{tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
                ) : (
                    <>
                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && overview && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Users", value: overview.totalUsers, icon: Users, color: "from-violet-500 to-indigo-600" },
                                        { label: "Total Calls", value: overview.totalCalls, icon: Phone, color: "from-blue-500 to-cyan-600" },
                                        { label: "Today's Calls", value: overview.todayCalls, icon: Clock, color: "from-emerald-500 to-teal-600" },
                                        { label: "Call Minutes", value: overview.totalCallMinutes, icon: BarChart3, color: "from-amber-500 to-orange-600" },
                                    ].map((stat, i) => (
                                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                                                <stat.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-2xl font-heading font-bold">{stat.value}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                                        <h3 className="font-heading font-bold text-sm mb-3">User Breakdown</h3>
                                        <div className="space-y-3">
                                            {[
                                                { plan: "Free", count: overview.freeUsers, color: "bg-gray-400" },
                                                { plan: "Pro", count: overview.proUsers, color: "bg-violet-500" },
                                                { plan: "Enterprise", count: overview.enterpriseUsers, color: "bg-amber-500" },
                                            ].map((p) => (
                                                <div key={p.plan} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${p.color}`} /><span className="text-sm">{p.plan}</span></div>
                                                    <span className="text-sm font-bold">{p.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                                        <h3 className="font-heading font-bold text-sm mb-3">Quick Stats</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Appointments</span><span className="font-bold">{overview.totalAppointments}</span></div>
                                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Knowledge Entries</span><span className="font-bold">{overview.activeKnowledge}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* USERS TAB */}
                        {activeTab === "users" && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-heading font-bold">All Users ({users.length})</h3></div>
                                <div className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <div key={user.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">{user.full_name?.charAt(0)}</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{user.full_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-right hidden sm:block">
                                                <p>{user.total_calls_made || 0} calls</p>
                                                <p>{user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never"}</p>
                                            </div>
                                            <select value={user.plan} onChange={(e) => handleChangePlan(user.id, e.target.value)} className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg border-0 appearance-none cursor-pointer ${planColors[user.plan] || planColors.free}`}>
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </div>
                                    ))}
                                    {users.length === 0 && <div className="px-6 py-12 text-center text-sm text-muted-foreground">No users yet</div>}
                                </div>
                            </div>
                        )}

                        {/* CALLS TAB */}
                        {activeTab === "calls" && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100"><h3 className="font-heading font-bold">Call Logs ({calls.length})</h3></div>
                                <div className="divide-y divide-gray-100">
                                    {calls.map((call) => (
                                        <div key={call.id} className="hover:bg-gray-50 transition-colors">
                                            <div className="px-6 py-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedCall(expandedCall === call.id ? null : call.id)}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${call.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">{call.session_id?.substring(0, 20) || "Unknown"}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(call.created_at).toLocaleString()}</p>
                                                </div>
                                                <div className="text-right text-xs text-muted-foreground hidden sm:block">
                                                    <p>{call.duration_seconds || 0}s duration</p>
                                                    <p className={call.status === "completed" ? "text-emerald-600" : "text-gray-500"}>{call.status}</p>
                                                </div>
                                                {expandedCall === call.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                            </div>
                                            {expandedCall === call.id && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 pb-4">
                                                    {call.ai_summary && <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 mb-3"><p className="text-xs font-semibold text-violet-700 mb-1">AI Summary</p><p className="text-sm text-violet-900">{call.ai_summary}</p></div>}
                                                    {call.transcript ? (
                                                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200"><p className="text-xs font-semibold text-gray-500 mb-2">Full Transcript</p><pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">{call.transcript}</pre></div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic">No transcript available</p>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                    {calls.length === 0 && <div className="px-6 py-12 text-center text-sm text-muted-foreground">No calls yet</div>}
                                </div>
                            </div>
                        )}

                        {/* PROVIDERS TAB */}
                        {activeTab === "providers" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-heading font-bold">Voice Provider Accounts</h3>
                                    <button onClick={() => setShowAddProvider(!showAddProvider)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20">
                                        <Plus className="w-4 h-4" />Add Account
                                    </button>
                                </div>

                                {showAddProvider && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-violet-200 p-6 shadow-sm">
                                        <h4 className="font-heading font-bold text-sm mb-4">Add New Provider Account</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                            <select value={newProvider.provider} onChange={(e) => setNewProvider({ ...newProvider, provider: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                                                <option value="vapi">Vapi</option>
                                                <option value="retell">Retell AI</option>
                                                <option value="bland">Bland AI</option>
                                            </select>
                                            <input type="email" placeholder="Account email" value={newProvider.account_email} onChange={(e) => setNewProvider({ ...newProvider, account_email: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                                            <input type="text" placeholder="Public API Key" value={newProvider.api_key_public} onChange={(e) => setNewProvider({ ...newProvider, api_key_public: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                                            <input type="password" placeholder="Private API Key" value={newProvider.api_key_private} onChange={(e) => setNewProvider({ ...newProvider, api_key_private: e.target.value })} className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={handleAddProvider} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">Save Account</button>
                                            <button onClick={() => setShowAddProvider(false)} className="px-5 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    {providers.map((p) => (
                                        <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.credits_remaining > 2 ? "bg-emerald-50 text-emerald-600" : p.credits_remaining > 0 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"}`}>
                                                <Server className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold uppercase">{p.provider}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{p.is_active ? "Active" : "Inactive"}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{p.account_email}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">Key: {p.api_key_public?.substring(0, 15)}...</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-xl font-heading font-bold ${p.credits_remaining > 2 ? "text-emerald-600" : p.credits_remaining > 0 ? "text-amber-600" : "text-red-600"}`}>${p.credits_remaining}</p>
                                                <p className="text-[10px] text-muted-foreground">credits left</p>
                                            </div>
                                            <button onClick={() => handleRemoveProvider(p.id)} className="w-9 h-9 rounded-lg hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {providers.length === 0 && (
                                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                                            <Server className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="font-heading font-bold">No provider accounts added</p>
                                            <p className="text-sm text-muted-foreground mt-1">Add your Vapi accounts to enable credit rotation</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
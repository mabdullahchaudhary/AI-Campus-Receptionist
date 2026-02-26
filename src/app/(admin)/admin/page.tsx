"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Phone,
    BarChart3,
    BookOpen,
    Shield,
    LogOut,
    Loader2,
    Crown,
    Clock,
    Server,
    Plus,
    Trash2,
    RefreshCw,
    Eye,
    Mic,
    ChevronDown,
    ChevronUp,
    Copy,
    Check,
    AlertCircle,
    Zap,
    Globe,
    Settings,
    TrendingUp,
    MessageSquare,
    Calendar,
    Key,
    ArrowUpRight,
} from "lucide-react";

interface OverviewData {
    totalUsers: number;
    freeUsers: number;
    proUsers: number;
    enterpriseUsers: number;
    totalCalls: number;
    todayCalls: number;
    totalCallMinutes: number;
    totalAppointments: number;
    activeKnowledge: number;
}

interface UserData {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    plan: string;
    total_calls_made: number;
    last_login_at: string;
    created_at: string;
}

interface CallData {
    id: string;
    session_id: string;
    status: string;
    duration_seconds: number;
    transcript: string;
    ai_summary: string;
    sentiment: string;
    created_at: string;
}

interface ProviderData {
    id: string;
    provider: string;
    account_email: string;
    api_key_public: string;
    api_key_private: string;
    credits_remaining: number;
    is_active: boolean;
    priority: number;
    assistant_id: string;
}

type Tab = "overview" | "users" | "calls" | "providers" | "settings";

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [calls, setCalls] = useState<CallData[]>([]);
    const [providers, setProviders] = useState<ProviderData[]>([]);
    const [expandedCall, setExpandedCall] = useState<string | null>(null);
    const [showAddProvider, setShowAddProvider] = useState(false);
    const [toast, setToast] = useState<{ type: string; msg: string } | null>(null);
    const [mainPrivateKey, setMainPrivateKey] = useState("");
    const [newProvider, setNewProvider] = useState({
        provider: "vapi",
        account_email: "",
        api_key_public: "",
        api_key_private: "",
        credits_remaining: 10,
    });

    const showToast = (type: string, msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchData = useCallback(
        async (section: string) => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/data?section=${section}`);
                if (res.status === 401) {
                    router.push("/admin/login");
                    return;
                }
                const data = await res.json();
                if (section === "overview") setOverview(data);
                if (section === "users") setUsers(data.users || []);
                if (section === "calls") setCalls(data.calls || []);
                if (section === "providers") setProviders(data.providers || []);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        },
        [router],
    );

    useEffect(() => {
        fetchData(activeTab === "settings" ? "providers" : activeTab);
    }, [activeTab, fetchData]);

    useEffect(() => {
        const saved = localStorage.getItem("admin_main_vapi_key");
        if (saved) setMainPrivateKey(saved);
    }, []);

    const saveMainKey = () => {
        localStorage.setItem("admin_main_vapi_key", mainPrivateKey);
        showToast("success", "Main Vapi private key saved locally!");
    };

    const handleChangePlan = async (userId: string, newPlan: string) => {
        setActionLoading(userId);
        await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "change_plan", userId, newPlan }),
        });
        await fetchData("users");
        showToast("success", `Plan changed to ${newPlan}`);
        setActionLoading(null);
    };

    const handleAddProvider = async () => {
        setActionLoading("add");
        const res = await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "add_provider", ...newProvider }),
        });
        const data = await res.json();
        if (data.success) {
            showToast("success", "Account added!");
            setShowAddProvider(false);
            setNewProvider({
                provider: "vapi",
                account_email: "",
                api_key_public: "",
                api_key_private: "",
                credits_remaining: 10,
            });
            fetchData("providers");
        } else showToast("error", data.error);
        setActionLoading(null);
    };

    const handleRemoveProvider = async (id: string) => {
        if (!confirm("Remove this provider account?")) return;
        await fetch("/api/admin/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remove_provider", providerId: id }),
        });
        fetchData("providers");
        showToast("success", "Account removed");
    };

    const handleClone = async (providerId: string) => {
        if (!mainPrivateKey) {
            showToast("error", "Set your main Vapi private key in Settings tab first!");
            setActiveTab("settings");
            return;
        }
        setActionLoading(providerId);
        try {
            const res = await fetch("/api/admin/vapi-clone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "clone_to_account", providerId, mainPrivateKey }),
            });
            const data = await res.json();
            if (data.success) {
                showToast("success", data.message);
                fetchData("providers");
            } else showToast("error", data.error);
        } catch (e: any) {
            showToast("error", e.message);
        }
        setActionLoading(null);
    };

    const handleCloneAll = async () => {
        if (!mainPrivateKey) {
            showToast("error", "Set main Vapi private key in Settings first!");
            setActiveTab("settings");
            return;
        }
        if (!confirm("Clone Riley to ALL accounts that haven't been cloned yet?")) return;
        setActionLoading("clone_all");
        try {
            const res = await fetch("/api/admin/vapi-clone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "clone_to_all", mainPrivateKey }),
            });
            const data = await res.json();
            if (data.success) showToast("success", data.message);
            else showToast("error", data.error);
            fetchData("providers");
        } catch (e: any) {
            showToast("error", e.message);
        }
        setActionLoading(null);
    };

    const handleReclone = async (providerId: string) => {
        if (!mainPrivateKey) {
            showToast("error", "Set main key in Settings!");
            return;
        }
        if (!confirm("Delete old Riley and create fresh clone?")) return;
        setActionLoading(providerId);
        try {
            const res = await fetch("/api/admin/vapi-clone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "reclone_account", providerId, mainPrivateKey }),
            });
            const data = await res.json();
            if (data.success) showToast("success", data.message);
            else showToast("error", data.error);
            fetchData("providers");
        } catch (e: any) {
            showToast("error", e.message);
        }
        setActionLoading(null);
    };

    const handleLogout = async () => {
        await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" }),
        });
        router.push("/admin/login");
    };

    const tabs = [
        { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
        { id: "users" as Tab, label: "Users", icon: Users },
        { id: "calls" as Tab, label: "Call Logs", icon: Phone },
        { id: "providers" as Tab, label: "Providers", icon: Server },
        { id: "settings" as Tab, label: "Settings", icon: Settings },
    ];

    const planColors: Record<string, string> = {
        free: "bg-gray-100 text-gray-600",
        pro: "bg-violet-100 text-violet-700",
        enterprise: "bg-amber-100 text-amber-700",
    };

    const totalCredits = providers.reduce((s, p) => s + (p.credits_remaining || 0), 0);
    const clonedCount = providers.filter((p) => p.assistant_id).length;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-violet-50/30">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 left-1/2 z-100 flex items-center gap-2 px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium ${
                            toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                        }`}
                    >
                        {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-heading font-bold">Superior AI</span>
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-2.5 py-0.5 rounded-md">
                                Admin
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {providers.length} accounts • ${totalCredits.toFixed(2)} credits
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                                    : "bg-white text-muted-foreground hover:bg-gray-50 border border-gray-200/60 shadow-sm"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {loading && activeTab !== "settings" ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        {activeTab === "overview" && overview && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {[
                                        {
                                            label: "Total Users",
                                            value: overview.totalUsers,
                                            icon: Users,
                                            gradient: "from-violet-500 to-indigo-600",
                                        },
                                        {
                                            label: "Total Calls",
                                            value: overview.totalCalls,
                                            icon: Phone,
                                            gradient: "from-blue-500 to-cyan-600",
                                        },
                                        {
                                            label: "Today",
                                            value: overview.todayCalls,
                                            icon: Zap,
                                            gradient: "from-emerald-500 to-teal-600",
                                        },
                                        {
                                            label: "Minutes Used",
                                            value: overview.totalCallMinutes,
                                            icon: Clock,
                                            gradient: "from-amber-500 to-orange-600",
                                        },
                                        {
                                            label: "Knowledge",
                                            value: overview.activeKnowledge,
                                            icon: BookOpen,
                                            gradient: "from-pink-500 to-rose-600",
                                        },
                                    ].map((s, i) => (
                                        <motion.div
                                            key={s.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-white rounded-2xl border border-gray-200/60 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.gradient} flex items-center justify-center mb-3 shadow-lg shadow-violet-500/10`}
                                            >
                                                <s.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-heading font-bold">{s.value}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
                                        <h3 className="font-heading font-bold text-sm flex items-center gap-2 mb-4">
                                            <Users className="w-4 h-4 text-violet-500" />
                                            User Breakdown
                                        </h3>
                                        {[
                                            {
                                                plan: "Free",
                                                count: overview.freeUsers,
                                                color: "bg-gray-400",
                                                pct: overview.totalUsers
                                                    ? Math.round((overview.freeUsers / overview.totalUsers) * 100)
                                                    : 0,
                                            },
                                            {
                                                plan: "Pro",
                                                count: overview.proUsers,
                                                color: "bg-violet-500",
                                                pct: overview.totalUsers
                                                    ? Math.round((overview.proUsers / overview.totalUsers) * 100)
                                                    : 0,
                                            },
                                            {
                                                plan: "Enterprise",
                                                count: overview.enterpriseUsers,
                                                color: "bg-amber-500",
                                                pct: overview.totalUsers
                                                    ? Math.round((overview.enterpriseUsers / overview.totalUsers) * 100)
                                                    : 0,
                                            },
                                        ].map((p) => (
                                            <div key={p.plan} className="mb-3">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-muted-foreground">{p.plan}</span>
                                                    <span className="font-bold">
                                                        {p.count} ({p.pct}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${p.color} transition-all`}
                                                        style={{ width: `${Math.max(p.pct, 2)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
                                        <h3 className="font-heading font-bold text-sm flex items-center gap-2 mb-4">
                                            <Server className="w-4 h-4 text-emerald-500" />
                                            Provider Status
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Total Accounts</span>
                                                <span className="font-bold">{providers.length}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Cloned (Riley)</span>
                                                <span className="font-bold text-emerald-600">
                                                    {clonedCount}/{providers.length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Total Credits</span>
                                                <span className="font-bold text-violet-600">
                                                    ${totalCredits.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Appointments</span>
                                                <span className="font-bold">{overview.totalAppointments}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-linear-to-br from-violet-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-500/25">
                                        <h3 className="font-heading font-bold text-sm flex items-center gap-2 mb-4">
                                            <TrendingUp className="w-4 h-4" />
                                            Quick Actions
                                        </h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => setActiveTab("providers")}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-colors"
                                            >
                                                <span>Manage Providers</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("users")}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-colors"
                                            >
                                                <span>View All Users</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("calls")}
                                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-colors"
                                            >
                                                <span>Read Transcripts</span>
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-heading font-bold">All Users ({users.length})</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt=""
                                                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                                    {user.full_name?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{user.full_name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground text-right hidden sm:block">
                                                <p>{user.total_calls_made || 0} calls</p>
                                                <p>
                                                    {user.created_at
                                                        ? new Date(user.created_at).toLocaleDateString()
                                                        : ""}
                                                </p>
                                            </div>
                                            <select
                                                value={user.plan}
                                                onChange={(e) => handleChangePlan(user.id, e.target.value)}
                                                disabled={actionLoading === user.id}
                                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border-0 cursor-pointer transition-all ${planColors[user.plan]}`}
                                            >
                                                <option value="free">Free</option>
                                                <option value="pro">Pro</option>
                                                <option value="enterprise">Enterprise</option>
                                            </select>
                                        </div>
                                    ))}
                                    {users.length === 0 && (
                                        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                                            No users registered yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "calls" && (
                            <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-heading font-bold">Call Logs ({calls.length})</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Click any call to read the full transcript
                                    </p>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {calls.map((call) => (
                                        <div key={call.id}>
                                            <div
                                                className="px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                                onClick={() =>
                                                    setExpandedCall(expandedCall === call.id ? null : call.id)
                                                }
                                            >
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                        call.status === "completed"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-gray-100 text-gray-400"
                                                    }`}
                                                >
                                                    <Phone className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {call.session_id?.substring(0, 24) || "Call"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(call.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right text-xs shrink-0 hidden sm:block">
                                                    <p className="font-semibold">
                                                        {call.duration_seconds || 0}
                                                        s
                                                    </p>
                                                    <p
                                                        className={
                                                            call.status === "completed"
                                                                ? "text-emerald-600"
                                                                : "text-gray-400"
                                                        }
                                                    >
                                                        {call.status}
                                                    </p>
                                                </div>
                                                {expandedCall === call.id ? (
                                                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                                                )}
                                            </div>
                                            <AnimatePresence>
                                                {expandedCall === call.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="px-4 sm:px-6 pb-4 overflow-hidden"
                                                    >
                                                        {call.ai_summary && (
                                                            <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 mb-3">
                                                                <p className="text-xs font-bold text-violet-700 mb-1 flex items-center gap-1">
                                                                    <MessageSquare className="w-3 h-3" />
                                                                    AI Summary
                                                                </p>
                                                                <p className="text-sm text-violet-900">
                                                                    {call.ai_summary}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {call.transcript ? (
                                                            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                                                                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                                                                    <Eye className="w-3 h-3" />
                                                                    Full Transcript
                                                                </p>
                                                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans max-h-72 overflow-y-auto leading-relaxed">
                                                                    {call.transcript}
                                                                </pre>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground italic p-4 bg-gray-50 rounded-xl">
                                                                No transcript recorded for this call
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                    {calls.length === 0 && (
                                        <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                                            No calls recorded yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "providers" && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div>
                                        <h3 className="font-heading font-bold">Voice Provider Accounts</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {providers.length} accounts • {clonedCount} cloned • $
                                            {totalCredits.toFixed(2)} total credits
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleCloneAll}
                                            disabled={actionLoading === "clone_all"}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                        >
                                            {actionLoading === "clone_all" ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                            Clone Riley to All
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setShowAddProvider(!showAddProvider)}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Account
                                        </motion.button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {showAddProvider && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bg-white rounded-2xl border-2 border-violet-200 p-6 shadow-lg"
                                        >
                                            <h4 className="font-heading font-bold text-sm mb-1">
                                                Add New Vapi Account
                                            </h4>
                                            <p className="text-xs text-muted-foreground mb-4">
                                                Use Gmail trick: mhabdullah000+vapi1@gmail.com
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                                <select
                                                    value={newProvider.provider}
                                                    onChange={(e) =>
                                                        setNewProvider({
                                                            ...newProvider,
                                                            provider: e.target.value,
                                                        })
                                                    }
                                                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                                                >
                                                    <option value="vapi">Vapi</option>
                                                    <option value="retell">Retell AI</option>
                                                    <option value="bland">Bland AI</option>
                                                </select>
                                                <input
                                                    type="email"
                                                    placeholder="Account email"
                                                    value={newProvider.account_email}
                                                    onChange={(e) =>
                                                        setNewProvider({
                                                            ...newProvider,
                                                            account_email: e.target.value,
                                                        })
                                                    }
                                                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Public API Key (pk_...)"
                                                    value={newProvider.api_key_public}
                                                    onChange={(e) =>
                                                        setNewProvider({
                                                            ...newProvider,
                                                            api_key_public: e.target.value,
                                                        })
                                                    }
                                                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono focus:outline-none focus:border-violet-400"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Private API Key (sk_...) — Required for cloning"
                                                    value={newProvider.api_key_private}
                                                    onChange={(e) =>
                                                        setNewProvider({
                                                            ...newProvider,
                                                            api_key_private: e.target.value,
                                                        })
                                                    }
                                                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono focus:outline-none focus:border-violet-400"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                            <button
                                                    onClick={handleAddProvider}
                                                    disabled={actionLoading === "add"}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
                                                >
                                                    {actionLoading === "add" ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    Save Account
                                                </button>
                                            <button
                                                    onClick={() => setShowAddProvider(false)}
                                                    className="px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-3">
                                    {providers.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                                            p.credits_remaining > 2
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : p.credits_remaining > 0
                                                                  ? "bg-amber-50 text-amber-600"
                                                                  : "bg-red-50 text-red-600"
                                                        }`}
                                                    >
                                                        <Server className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-sm font-bold uppercase">
                                                                {p.provider}
                                                            </span>
                                                            <span
                                                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                                                    p.is_active
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-red-100 text-red-700"
                                                                }`}
                                                            >
                                                                {p.is_active ? "Active" : "Inactive"}
                                                            </span>
                                                            {p.assistant_id && (
                                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center gap-1">
                                                                    <Check className="w-2.5 h-2.5" />
                                                                    Riley Cloned
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                            {p.account_email}
                                                        </p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p
                                                            className={`text-2xl font-heading font-bold ${
                                                                p.credits_remaining > 2
                                                                    ? "text-emerald-600"
                                                                    : p.credits_remaining > 0
                                                                      ? "text-amber-600"
                                                                      : "text-red-600"
                                                            }`}
                                                        >
                                                            ${p.credits_remaining}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground">credits</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center gap-2 flex-wrap">
                                                {!p.assistant_id ? (
                                            <button
                                                        onClick={() => handleClone(p.id)}
                                                        disabled={actionLoading === p.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold hover:bg-violet-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === p.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <Copy className="w-3 h-3" />
                                                        )}
                                                        Clone Riley
                                                    </button>
                                                ) : (
                                            <button
                                                        onClick={() => handleReclone(p.id)}
                                                        disabled={actionLoading === p.id}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold hover:bg-amber-200 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading === p.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="w-3 h-3" />
                                                        )}
                                                        Re-clone
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveProvider(p.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-100 text-xs text-muted-foreground hover:text-red-600 transition-colors ml-auto"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Remove
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {providers.length === 0 && (
                                        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
                                            <Server className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                                            <p className="font-heading font-bold text-lg">No provider accounts yet</p>
                                            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                                                Create 10 Vapi accounts using the Gmail + trick, add them here, then
                                                click &quot;Clone Riley to All&quot; to set up all accounts in one
                                                click!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "settings" && (
                            <div className="space-y-6 max-w-2xl">
                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
                                    <h3 className="font-heading font-bold flex items-center gap-2 mb-1">
                                        <Key className="w-5 h-5 text-violet-500" />
                                        Main Vapi Private Key
                                    </h3>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        This is the private key from your MAIN Vapi account (mhabdullah000@gmail.com).
                                        It is used to export Riley&apos;s config for cloning to other accounts and is
                                        stored locally in your browser only.
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            type="password"
                                            value={mainPrivateKey}
                                            onChange={(e) => setMainPrivateKey(e.target.value)}
                                            placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono focus:outline-none focus:border-violet-400"
                                        />
                                        <button
                                            onClick={saveMainKey}
                                            className="px-5 py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold shrink-0"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm">
                                    <h3 className="font-heading font-bold flex items-center gap-2 mb-4">
                                        <Globe className="w-5 h-5 text-blue-500" />
                                        How Cloning Works
                                    </h3>
                                    <div className="space-y-3 text-sm text-muted-foreground">
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                1
                                            </span>
                                            <p>
                                                Your main Vapi account has Riley with all tools, model, voice, and
                                                system prompt configured.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                2
                                            </span>
                                            <p>
                                                When you click &quot;Clone&quot;, the main private key is used to export
                                                Riley&apos;s configuration via the Vapi API.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                3
                                            </span>
                                            <p>
                                                The same assistant is then created on the target account using that
                                                account&apos;s private key.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                4
                                            </span>
                                            <p>
                                                If you update Riley on your main account, use &quot;Re-clone&quot; to
                                                push the updated configuration to other accounts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


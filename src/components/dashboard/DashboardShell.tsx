"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, LayoutDashboard, Phone, PhoneCall, Users, Calendar, Settings,
    Key, BarChart3, CreditCard, LogOut, Menu, X, Crown, Lock, BookOpen,
    ChevronLeft, Bell, Search, Sparkles,
} from "lucide-react";
import { PLAN_LIMITS } from "@/lib/config";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    requiredPlan?: string;
}

const navSections = [
    {
        title: "Main",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "New Call", href: "/dashboard/call", icon: PhoneCall, badge: "AI" },
            { name: "Call History", href: "/dashboard/calls", icon: Phone },
        ] as NavItem[],
    },
    {
        title: "AI Training",
        items: [
            { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
        ] as NavItem[],
    },
    {
        title: "Business",
        items: [
            { name: "Contacts", href: "/dashboard/contacts", icon: Users, requiredPlan: "pro" },
            { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, requiredPlan: "pro" },
            { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, requiredPlan: "pro" },
        ] as NavItem[],
    },
    {
        title: "Account",
        items: [
            { name: "API Keys (BYOK)", href: "/dashboard/api-keys", icon: Key, requiredPlan: "pro" },
            { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
            { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ] as NavItem[],
    },
];

function isPlanAllowed(userPlan: string, requiredPlan?: string): boolean {
    if (!requiredPlan) return true;
    const order = ["free", "pro", "enterprise"];
    return order.indexOf(userPlan) >= order.indexOf(requiredPlan);
}

export default function DashboardShell({
    children,
    user,
}: {
    children: React.ReactNode;
    user: { name?: string | null; email?: string | null; image?: string | null; plan?: string };
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const userPlan = (user.plan as string) || "free";

    const planConfig: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = {
        free: { color: "text-gray-600", bg: "bg-gray-100", label: "Free", icon: Sparkles },
        pro: { color: "text-violet-700", bg: "bg-violet-100", label: "Pro", icon: Crown },
        enterprise: { color: "text-amber-700", bg: "bg-amber-100", label: "Enterprise", icon: Crown },
    };

    const currentPlan = planConfig[userPlan] || planConfig.free;

    // Get current page title
    const currentPage = navSections.flatMap((s) => s.items).find((i) => i.href === pathname);

    return (
        <div className="min-h-screen flex bg-background">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200/80 transform transition-all duration-300 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${collapsed ? "w-[72px]" : "w-[260px]"}`}>
                {/* Logo */}
                <div className={`flex items-center h-16 border-b border-gray-100 shrink-0 ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="text-[15px] font-heading font-bold tracking-tight">
                                Superior<span className="gradient-text"> AI</span>
                            </span>
                        )}
                    </Link>
                    {!collapsed && (
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                    {navSections.map((section) => (
                        <div key={section.title}>
                            {!collapsed && (
                                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                    {section.title}
                                </p>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const isLocked = !isPlanAllowed(userPlan, item.requiredPlan);

                                    if (isLocked) {
                                        return (
                                            <div key={item.name} className={`flex items-center gap-2.5 py-2 rounded-xl text-sm text-gray-300 cursor-not-allowed group relative ${collapsed ? "justify-center px-2" : "px-3"}`}>
                                                <item.icon className="w-[18px] h-[18px] shrink-0" />
                                                {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                                                {!collapsed && <Lock className="w-3 h-3" />}
                                                {collapsed && (
                                                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                        {item.name} — Upgrade to {item.requiredPlan}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-2.5 py-2 rounded-xl text-sm transition-all duration-200 group relative ${collapsed ? "justify-center px-2" : "px-3"} ${isActive ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
                                            <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-violet-600" : ""}`} />
                                            {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                                            {!collapsed && item.badge && (
                                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600">{item.badge}</span>
                                            )}
                                            {collapsed && (
                                                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                    {item.name}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Upgrade Card */}
                {!collapsed && userPlan === "free" && (
                    <div className="px-3 py-3">
                        <Link href="/dashboard/billing">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200/60 hover:border-violet-300 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-4 h-4 text-violet-600" />
                                    <span className="text-xs font-bold text-violet-700">Upgrade to Pro</span>
                                </div>
                                <p className="text-[11px] text-violet-600/70 leading-relaxed">Unlock unlimited calls, CRM, analytics & more</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* User Profile */}
                <div className={`border-t border-gray-100 shrink-0 ${collapsed ? "p-2" : "p-3"}`}>
                    <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : "px-2 py-1.5"}`}>
                        {user.image ? (
                            <img src={user.image} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${currentPlan.bg} ${currentPlan.color}`}>
                                    {currentPlan.label}
                                </span>
                            </div>
                        )}
                        {!collapsed && (
                            <button onClick={() => signOut({ callbackUrl: "/" })} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Sign out">
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Collapse toggle — desktop only */}
                <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10">
                    <ChevronLeft className={`w-3 h-3 text-gray-400 transition-transform ${collapsed ? "rotate-180" : ""}`} />
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <header className="h-16 flex items-center gap-4 px-4 sm:px-6 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shrink-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Menu className="w-4.5 h-4.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base font-heading font-bold truncate">{currentPage?.name || "Dashboard"}</h1>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${currentPlan.bg} ${currentPlan.color}`}>
                        {currentPlan.label} Plan
                    </span>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
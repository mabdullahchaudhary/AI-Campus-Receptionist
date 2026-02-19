"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    Mic, LayoutDashboard, Phone, Users, Calendar, Settings, Key, BarChart3,
    CreditCard, LogOut, Menu, X, Crown, Lock, BookOpen,
} from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    requiredPlan?: string;
}

const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "New Call", href: "/dashboard/call", icon: Phone },
    { name: "Call History", href: "/dashboard/calls", icon: Phone },
    { name: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users, requiredPlan: "pro" },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, requiredPlan: "pro" },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, requiredPlan: "pro" },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Key, requiredPlan: "pro" },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
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
    const userPlan = (user.plan as string) || "free";

    const planBadge: Record<string, string> = {
        free: "bg-gray-100 text-gray-600",
        pro: "bg-violet-100 text-violet-700",
        enterprise: "bg-amber-100 text-amber-700",
    };

    return (
        <div className="min-h-screen flex bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-heading font-bold">
                            Superior<span className="gradient-text"> AI</span>
                        </span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isLocked = !isPlanAllowed(userPlan, item.requiredPlan);

                        if (isLocked) {
                            return (
                                <div key={item.name} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-300 cursor-not-allowed group relative">
                                    <item.icon className="w-[18px] h-[18px]" />
                                    <span className="flex-1">{item.name}</span>
                                    <Lock className="w-3.5 h-3.5" />
                                    <div className="absolute left-full ml-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                        Upgrade to {item.requiredPlan}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive ? "bg-violet-50 text-violet-700 font-medium" : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"}`}>
                                <item.icon className="w-[18px] h-[18px]" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    {userPlan === "free" && (
                        <Link href="/dashboard/billing" className="flex items-center gap-2 px-4 py-3 mb-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 text-sm hover:border-violet-300 transition-colors">
                            <Crown className="w-4 h-4 text-violet-600" />
                            <span className="text-violet-700 font-medium">Upgrade to Pro</span>
                        </Link>
                    )}

                    <div className="flex items-center gap-3 px-4 py-2">
                        {user.image ? (
                            <img src={user.image} alt={user.name || ""} className="w-9 h-9 rounded-xl object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${planBadge[userPlan]}`}>
                                {userPlan}
                            </span>
                        </div>
                        <button onClick={() => signOut({ callbackUrl: "/" })} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen">
                <header className="h-[72px] flex items-center gap-4 px-6 border-b border-border bg-white lg:bg-transparent lg:border-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg ${planBadge[userPlan]}`}>
                        {userPlan} plan
                    </span>
                </header>
                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
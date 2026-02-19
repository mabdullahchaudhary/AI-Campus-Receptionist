"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    Mic,
    LayoutDashboard,
    Phone,
    Users,
    Calendar,
    Settings,
    Key,
    BarChart3,
    CreditCard,
    LogOut,
    Menu,
    X,
    ChevronUp,
    Crown,
    Lock,
    BookOpen,
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
    const planOrder = ["free", "pro", "enterprise"];
    return planOrder.indexOf(userPlan) >= planOrder.indexOf(requiredPlan);
}

export default function DashboardShell({
    children,
    user,
}: {
    children: React.ReactNode;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        plan?: string;
    };
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const userPlan = (user.plan as string) || "free";

    const planColors: Record<string, string> = {
        free: "bg-zinc-500/20 text-zinc-400",
        pro: "bg-violet-500/20 text-violet-400",
        enterprise: "bg-amber-500/20 text-amber-400",
    };

    return (
        <div className="min-h-screen flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col glass-strong border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/5">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Mic className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-base font-heading font-bold">
                            Superior<span className="gradient-text"> AI</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isLocked = !isPlanAllowed(userPlan, item.requiredPlan);

                        if (isLocked) {
                            return (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground/40 cursor-not-allowed group relative"
                                >
                                    <item.icon className="w-[18px] h-[18px]" />
                                    <span className="flex-1">{item.name}</span>
                                    <Lock className="w-3.5 h-3.5" />
                                    {/* Tooltip */}
                                    <div className="absolute left-full ml-2 px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Upgrade to {item.requiredPlan} plan
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 ${isActive
                                    ? "bg-violet-500/10 text-violet-400 font-medium"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="w-[18px] h-[18px]" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-white/5">
                    {/* Plan badge */}
                    {userPlan === "free" && (
                        <Link
                            href="/dashboard/billing"
                            className="flex items-center gap-2 px-4 py-3 mb-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-sm hover:border-violet-500/40 transition-colors"
                        >
                            <Crown className="w-4 h-4 text-violet-400" />
                            <span className="text-violet-300 font-medium">Upgrade to Pro</span>
                        </Link>
                    )}

                    <div className="flex items-center gap-3 px-4 py-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || ""}
                                className="w-9 h-9 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${planColors[userPlan]}`}
                                >
                                    {userPlan}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="h-[72px] flex items-center gap-4 px-6 border-b border-white/5 glass-strong lg:bg-transparent lg:border-0 lg:backdrop-blur-none">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1" />
                    <div
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg ${planColors[userPlan]}`}
                    >
                        {userPlan} plan
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
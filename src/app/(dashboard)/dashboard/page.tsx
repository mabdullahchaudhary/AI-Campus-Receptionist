"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Phone,
    Users,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    Clock,
    Mic,
    Crown,
} from "lucide-react";
import Link from "next/link";

function StatCard({
    icon: Icon,
    label,
    value,
    change,
    gradient,
    delay,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    change: string;
    gradient: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="p-6 rounded-2xl glass card-shine hover:bg-white/[0.04] transition-all duration-300"
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {change}
                </span>
            </div>
            <p className="text-2xl font-heading font-bold">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </motion.div>
    );
}

export default function DashboardPage() {
    const { data: session } = useSession();
    const plan = session?.user?.plan || "free";
    const firstName = session?.user?.name?.split(" ")[0] || "there";

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-heading font-extrabold">
                    Welcome back, <span className="gradient-text">{firstName}</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here&apos;s what&apos;s happening with your AI receptionist today.
                </p>
            </motion.div>

            {/* Free plan banner */}
            {plan === "free" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Link href="/dashboard/billing">
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 border border-violet-500/20 flex items-center justify-between hover:border-violet-500/40 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <Crown className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        You&apos;re on the Free plan — 3 calls/day, 60s limit
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Upgrade to Pro for unlimited calls, full dashboard, BYOK, and more.
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm text-violet-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                Upgrade <ArrowUpRight className="w-4 h-4" />
                            </span>
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={Phone}
                    label="Total Calls Today"
                    value="0"
                    change="—"
                    gradient="from-violet-500 to-purple-600"
                    delay={0.1}
                />
                <StatCard
                    icon={Users}
                    label="Contacts Captured"
                    value="0"
                    change="—"
                    gradient="from-blue-500 to-indigo-600"
                    delay={0.15}
                />
                <StatCard
                    icon={Calendar}
                    label="Appointments"
                    value="0"
                    change="—"
                    gradient="from-emerald-500 to-teal-600"
                    delay={0.2}
                />
                <StatCard
                    icon={Clock}
                    label="Avg. Call Duration"
                    value="0s"
                    change="—"
                    gradient="from-amber-500 to-orange-600"
                    delay={0.25}
                />
            </div>

            {/* Quick actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <h2 className="text-lg font-heading font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            icon: Mic,
                            title: "Test AI Call",
                            description: "Make a test call to your AI receptionist",
                            href: "#",
                            gradient: "from-violet-500 to-indigo-600",
                        },
                        {
                            icon: Phone,
                            title: "View Call Logs",
                            description: "See recent calls and transcripts",
                            href: "/dashboard/calls",
                            gradient: "from-blue-500 to-cyan-600",
                        },
                        {
                            icon: TrendingUp,
                            title: plan === "free" ? "Upgrade Plan" : "View Analytics",
                            description:
                                plan === "free"
                                    ? "Unlock full dashboard features"
                                    : "Check detailed analytics",
                            href: plan === "free" ? "/dashboard/billing" : "/dashboard/analytics",
                            gradient: "from-emerald-500 to-teal-600",
                        },
                    ].map((action, i) => (
                        <Link key={i} href={action.href}>
                            <div className="p-6 rounded-2xl glass card-shine hover:bg-white/[0.04] transition-all duration-300 glow-hover group cursor-pointer h-full">
                                <div
                                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-heading font-bold">{action.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
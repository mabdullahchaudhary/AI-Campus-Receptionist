"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Building2 } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        icon: Sparkles,
        gradient: "from-zinc-500 to-zinc-600",
        features: ["3 calls/day", "60-second limit", "Last 5 call logs", "1 AI assistant", "Basic analytics"],
        current: true,
    },
    {
        name: "Pro",
        price: "$49",
        period: "/month",
        icon: Crown,
        gradient: "from-violet-500 to-indigo-600",
        features: ["Unlimited calls", "60-minute limit", "Full call history", "5 AI assistants", "Advanced analytics", "Contact CRM", "Appointments", "BYOK support", "Email notifications", "Priority support"],
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "$199",
        period: "/month",
        icon: Building2,
        gradient: "from-amber-500 to-orange-600",
        features: ["Everything in Pro", "Unlimited assistants", "Multi-tenant", "White-label", "API access", "Team management", "Custom domain", "Dedicated support", "SLA 99.9%"],
    },
];

export default function BillingPage() {
    const { data: session } = useSession();
    const currentPlan = session?.user?.plan || "free";

    return (
        <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-heading font-extrabold">Billing & Plans</h1>
                <p className="text-muted-foreground mt-1">Manage your subscription and unlock more features.</p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative p-7 rounded-2xl ${plan.highlighted ? "glass glow border border-violet-500/30" : "glass"
                            }`}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                                Recommended
                            </div>
                        )}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                            <plan.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-heading font-bold">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-heading font-extrabold">{plan.price}</span>
                            <span className="text-sm text-muted-foreground">{plan.period}</span>
                        </div>

                        <button
                            className={`w-full mt-6 py-3 rounded-xl text-sm font-semibold transition-all ${currentPlan === plan.name.toLowerCase()
                                ? "bg-white/5 text-muted-foreground cursor-default"
                                : plan.highlighted
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 glow"
                                    : "bg-white/5 text-foreground hover:bg-white/10"
                                }`}
                            disabled={currentPlan === plan.name.toLowerCase()}
                        >
                            {currentPlan === plan.name.toLowerCase() ? "Current Plan" : `Upgrade to ${plan.name}`}
                        </button>

                        <div className="mt-6 space-y-3">
                            {plan.features.map((f) => (
                                <div key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <Check className="w-4 h-4 text-violet-400 shrink-0" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
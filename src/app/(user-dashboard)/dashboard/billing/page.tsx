"use client";

import { useSession } from "next-auth/react";
import { Check, X, Crown, Zap, Building2 } from "lucide-react";
import { PageHeader, Badge } from "@/components/ui/Skeleton";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        icon: Zap,
        gradient: "from-gray-500 to-gray-600",
        shadow: "",
        tier: "free",
        highlighted: false,
        features: [
            { name: "2-minute call limit", included: true },
            { name: "1 call per day", included: true },
            { name: "Basic transcript", included: true },
            { name: "Knowledge base (view)", included: true },
            { name: "16 AI tools", included: true },
            { name: "Multi-language (EN/UR)", included: true },
            { name: "Contact CRM", included: false },
            { name: "Appointments", included: false },
            { name: "Analytics", included: false },
            { name: "BYOK (API Keys)", included: false },
            { name: "Unlimited calls", included: false },
            { name: "Priority support", included: false },
        ],
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        icon: Crown,
        gradient: "from-violet-600 to-indigo-600",
        shadow: "shadow-xl shadow-violet-500/20",
        tier: "pro",
        highlighted: true,
        features: [
            { name: "60-minute daily limit", included: true },
            { name: "Unlimited calls per day", included: true },
            { name: "Full transcripts + summaries", included: true },
            { name: "Knowledge base (full CRUD)", included: true },
            { name: "16 AI tools", included: true },
            { name: "Multi-language (EN/UR)", included: true },
            { name: "Contact CRM", included: true },
            { name: "Appointments", included: true },
            { name: "Analytics dashboard", included: true },
            { name: "BYOK (your API keys)", included: true },
            { name: "30-min per call limit", included: true },
            { name: "Priority support", included: true },
        ],
    },
    {
        name: "Enterprise",
        price: "$99",
        period: "/month",
        icon: Building2,
        gradient: "from-amber-500 to-orange-600",
        shadow: "",
        tier: "enterprise",
        highlighted: false,
        features: [
            { name: "Unlimited everything", included: true },
            { name: "Custom phone number", included: true },
            { name: "Custom AI voice", included: true },
            { name: "Full API access", included: true },
            { name: "White label option", included: true },
            { name: "All Pro features", included: true },
            { name: "Multi-university support", included: true },
            { name: "Custom integrations", included: true },
            { name: "Dedicated account manager", included: true },
            { name: "SLA guarantee", included: true },
            { name: "Custom training data", included: true },
            { name: "24/7 phone support", included: true },
        ],
    },
];

export default function BillingPage() {
    const { data: session } = useSession();
    const currentPlan = (session?.user as any)?.plan || "free";

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Billing & Plans" subtitle="Choose the plan that fits your needs" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const isCurrent = currentPlan === plan.tier;
                    return (
                        <div key={plan.name} className={`bg-white rounded-2xl border overflow-hidden transition-all ${plan.highlighted ? `border-violet-300 ${plan.shadow} ring-1 ring-violet-200` : "border-gray-200/60 shadow-card hover:shadow-card-hover"}`}>
                            {plan.highlighted && (
                                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-center py-1.5">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                                </div>
                            )}
                            <div className="p-5 sm:p-6">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                    <plan.icon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-heading font-bold text-lg">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <span className="text-3xl font-heading font-extrabold">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                                </div>
                                <div className="mt-5 space-y-2.5">
                                    {plan.features.map((f) => (
                                        <div key={f.name} className="flex items-center gap-2.5">
                                            {f.included ? (
                                                <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-emerald-600" /></div>
                                            ) : (
                                                <div className="w-4 h-4 rounded-full bg-gray-50 flex items-center justify-center shrink-0"><X className="w-2.5 h-2.5 text-gray-300" /></div>
                                            )}
                                            <span className={`text-xs ${f.included ? "text-gray-700" : "text-gray-300"}`}>{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`w-full mt-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${isCurrent ? "bg-gray-100 text-gray-500 cursor-default" : plan.highlighted ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl" : "bg-gray-900 text-white hover:bg-gray-800"}`}>
                                    {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Check, X, Crown, Zap, Building2, CreditCard, Landmark, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/Skeleton";

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

type CheckoutTab = "stripe" | "manual";

export default function BillingPage() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const currentPlan = (session?.user as { plan?: string })?.plan || "free";
    const [checkoutTab, setCheckoutTab] = useState<CheckoutTab>("stripe");
    const [stripeLoading, setStripeLoading] = useState(false);
    const [manualTid, setManualTid] = useState("");
    const [manualLoading, setManualLoading] = useState(false);
    const [manualMessage, setManualMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [banner, setBanner] = useState<{ type: "success" | "canceled"; text: string } | null>(null);

    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");
        if (success === "true") setBanner({ type: "success", text: "Success! Plan Upgraded." });
        if (canceled === "true") setBanner({ type: "canceled", text: "Checkout was canceled." });
    }, [searchParams]);

    const handleStripeCheckout = async () => {
        setStripeLoading(true);
        try {
            const res = await fetch("/api/billing/checkout", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Checkout failed");
            if (data.url) window.location.href = data.url;
            else throw new Error("No checkout URL");
        } catch (e) {
            setBanner({ type: "canceled", text: e instanceof Error ? e.message : "Checkout failed" });
        }
        setStripeLoading(false);
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tid = manualTid.trim();
        if (!tid) {
            setManualMessage({ type: "error", text: "Please enter your Bank/JazzCash Transaction ID." });
            return;
        }
        setManualLoading(true);
        setManualMessage(null);
        try {
            const res = await fetch("/api/billing/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transactionId: tid }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Submission failed");
            setManualMessage({ type: "success", text: "Payment Pending Admin Approval." });
            setManualTid("");
        } catch (e) {
            setManualMessage({ type: "error", text: e instanceof Error ? e.message : "Submission failed" });
        }
        setManualLoading(false);
    };

    const currentPlanConfig = plans.find((p) => p.tier === currentPlan) || plans[0];

    return (
        <div className="space-y-6 max-w-5xl">
            <PageHeader title="Billing & Plans" subtitle="Manage your plan and payment method" />

            {banner && (
                <div className={`rounded-xl border p-4 flex items-center gap-3 ${banner.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                    {banner.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <p className="text-sm font-medium">{banner.text}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Current plan</p>
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${currentPlanConfig.gradient} flex items-center justify-center shadow-lg`}>
                        <currentPlanConfig.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-heading font-bold text-lg">{currentPlanConfig.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentPlanConfig.price}{currentPlanConfig.period !== "forever" ? currentPlanConfig.period : ""}</p>
                    </div>
                </div>
            </div>

            {currentPlan === "free" && status === "authenticated" && (
                <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm">
                    <div className="border-b border-gray-100 flex">
                        <button
                            type="button"
                            onClick={() => setCheckoutTab("stripe")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${checkoutTab === "stripe" ? "bg-violet-50 text-violet-700 border-b-2 border-violet-600" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <CreditCard className="w-4 h-4" />
                            Pay with Card (Stripe)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCheckoutTab("manual")}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${checkoutTab === "manual" ? "bg-violet-50 text-violet-700 border-b-2 border-violet-600" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                            <Landmark className="w-4 h-4" />
                            Pay via Local Bank (Submit TID)
                        </button>
                    </div>
                    <div className="p-6">
                        {checkoutTab === "stripe" && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">Secure payment via Stripe. You will be redirected to complete payment.</p>
                                <button
                                    type="button"
                                    onClick={handleStripeCheckout}
                                    disabled={stripeLoading}
                                    className="w-full py-3 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {stripeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                    Continue to Stripe Checkout — $29/month
                                </button>
                            </div>
                        )}
                        {checkoutTab === "manual" && (
                            <form onSubmit={handleManualSubmit} className="space-y-4">
                                <p className="text-sm text-muted-foreground">After paying via Bank Transfer or JazzCash, enter your Transaction ID below. Your Pro upgrade will be activated after admin verification.</p>
                                <input
                                    type="text"
                                    value={manualTid}
                                    onChange={(e) => setManualTid(e.target.value)}
                                    placeholder="Bank / JazzCash Transaction ID (TID)"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                                />
                                {manualMessage && (
                                    <p className={`text-sm ${manualMessage.type === "success" ? "text-emerald-600" : "text-red-600"}`}>{manualMessage.text}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={manualLoading}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {manualLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit for verification"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const isCurrent = currentPlan === plan.tier;
                    return (
                        <div key={plan.name} className={`bg-white rounded-2xl border overflow-hidden transition-all ${plan.highlighted ? `border-violet-300 ${plan.shadow} ring-1 ring-violet-200` : "border-gray-200/60 shadow-card hover:shadow-card-hover"}`}>
                            {plan.highlighted && (
                                <div className="bg-linear-to-r from-violet-600 to-indigo-600 text-center py-1.5">
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                                </div>
                            )}
                            <div className="p-5 sm:p-6">
                                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
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
                                <div className={`w-full mt-6 py-2.5 rounded-xl text-sm font-semibold text-center ${isCurrent ? "bg-gray-100 text-gray-500" : "text-gray-400"}`}>
                                    {isCurrent ? "Current Plan" : plan.tier === "enterprise" ? "Contact Sales" : "Upgrade in section above"}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

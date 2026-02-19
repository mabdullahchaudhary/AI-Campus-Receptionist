"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { PricingPlan } from "@/types";

const plans: PricingPlan[] = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out our AI receptionist",
        tier: "free",
        highlighted: false,
        buttonText: "Start Free",
        features: [
            "3 calls per day",
            "60-second call limit",
            "Basic call history (last 5)",
            "1 AI assistant",
            "English + Urdu support",
            "Community support",
            "Web call widget",
            "Basic analytics",
        ],
    },
    {
        name: "Pro",
        price: "$49",
        period: "per month",
        description: "For universities serious about automation",
        tier: "pro",
        highlighted: true,
        buttonText: "Upgrade to Pro",
        features: [
            "Unlimited calls",
            "60-minute call limit",
            "Full call history + transcripts",
            "5 AI assistants",
            "Multi-language auto-detect",
            "Priority support",
            "Contact management (CRM)",
            "Appointment scheduling",
            "BYOK — Bring Your Own Keys",
            "Custom AI persona",
            "Email notifications",
            "Advanced analytics dashboard",
            "Sentiment analysis",
            "CSV export",
        ],
    },
    {
        name: "Enterprise",
        price: "$199",
        period: "per month",
        description: "White-label solution for large institutions",
        tier: "enterprise",
        highlighted: false,
        buttonText: "Contact Sales",
        features: [
            "Everything in Pro",
            "Unlimited AI assistants",
            "Multi-tenant management",
            "White-label branding",
            "Custom domain",
            "Team management + roles",
            "API access",
            "WhatsApp integration",
            "Stripe billing integration",
            "Provider fallback (Vapi→Twilio)",
            "AI training with custom docs",
            "Dedicated account manager",
            "SLA guarantee (99.9%)",
            "On-premise deployment option",
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-space)]">
                        Simple, <span className="gradient-text">Transparent</span> Pricing
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Start free. Upgrade when you&apos;re ready. No hidden fees. Cancel anytime.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className={`relative rounded-2xl p-8 ${plan.highlighted
                                ? "glass glow border border-purple-500/30 scale-105"
                                : "glass border border-border/50"
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Most Popular
                                </div>
                            )}

                            {/* Plan Icon */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.tier === "free"
                                ? "bg-gray-800"
                                : plan.tier === "pro"
                                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                                    : "bg-gradient-to-br from-amber-600 to-orange-600"
                                }`}>
                                {plan.tier === "free" && <Rocket className="w-6 h-6 text-gray-400" />}
                                {plan.tier === "pro" && <Sparkles className="w-6 h-6 text-white" />}
                                {plan.tier === "enterprise" && <Building2 className="w-6 h-6 text-white" />}
                            </div>

                            <h3 className="text-xl font-bold font-[family-name:var(--font-space)]">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>

                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold font-[family-name:var(--font-space)]">
                                    {plan.price}
                                </span>
                                <span className="text-sm text-muted-foreground">/{plan.period}</span>
                            </div>

                            <Link href="/login" className="block mt-6">
                                <Button
                                    className={`w-full rounded-xl py-5 ${plan.highlighted
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                                        : "bg-secondary hover:bg-secondary/80"
                                        }`}
                                >
                                    {plan.buttonText}
                                </Button>
                            </Link>

                            <div className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-purple-400" : "text-muted-foreground"
                                            }`} />
                                        <span className="text-sm text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
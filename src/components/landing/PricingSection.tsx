"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X, Sparkles, Building2, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Try Riley AI — no card, no commitment",
    icon: Zap,
    gradient: "from-gray-600 to-gray-800",
    tier: "free",
    highlighted: false,
    buttonText: "Start Free",
    features: [
      { text: "1 call per day", included: true },
      { text: "2-minute call limit", included: true },
      { text: "All 16 AI tools active", included: true },
      { text: "English + Urdu + Urdlish", included: true },
      { text: "Basic call history (last 10)", included: true },
      { text: "Knowledge base (view only)", included: true },
      { text: "6-layer security", included: true },
      { text: "Live transcript", included: true },
      { text: "Contact CRM", included: false },
      { text: "Appointments & visits", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "BYOK (own API keys)", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    desc: "For universities serious about automation",
    icon: Sparkles,
    gradient: "from-violet-600 to-indigo-600",
    tier: "pro",
    highlighted: true,
    buttonText: "Upgrade to Pro",
    features: [
      { text: "Unlimited calls per day", included: true },
      { text: "60-minute daily limit", included: true },
      { text: "All 16 AI tools active", included: true },
      { text: "English + Urdu + Urdlish", included: true },
      { text: "Full call history + transcripts", included: true },
      { text: "Knowledge base (full CRUD)", included: true },
      { text: "6-layer security", included: true },
      { text: "Live transcript + AI summaries", included: true },
      { text: "Contact CRM with lead scoring", included: true },
      { text: "Campus visit appointments", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "BYOK — bring your own keys", included: true },
      { text: "Callback scheduling", included: true },
      { text: "CSV export", included: true },
      { text: "Priority email support", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    desc: "Custom solution for large institutions",
    icon: Building2,
    gradient: "from-amber-500 to-orange-600",
    tier: "enterprise",
    highlighted: false,
    buttonText: "Contact Sales",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited call duration", included: true },
      { text: "Custom phone number (Twilio)", included: true },
      { text: "Custom AI voice training", included: true },
      { text: "Multi-account provider rotation", included: true },
      { text: "White-label branding", included: true },
      { text: "Full REST API access", included: true },
      { text: "Custom domain support", included: true },
      { text: "WhatsApp integration", included: true },
      { text: "SMS follow-ups", included: true },
      { text: "Team management + roles", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantee (99.9%)", included: true },
      { text: "24/7 phone support", included: true },
    ],
  },
];

export default function PricingSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" ref={ref} className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
            Pricing
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-heading font-extrabold tracking-tight leading-tight">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-[15px] text-gray-500 mt-3">Start free. Upgrade when ready. No hidden fees. Cancel anytime.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl border overflow-hidden transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${plan.highlighted
                  ? "border-violet-300 shadow-xl shadow-violet-500/15 ring-1 ring-violet-200 md:scale-[1.04] z-10"
                  : "border-gray-200/60 shadow-card hover:shadow-card-hover"
                }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-center py-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-7">
                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-heading font-bold">{plan.name}</h3>
                    <p className="text-[11px] text-gray-400">{plan.desc}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-2 mb-6">
                  <span className="text-[38px] font-heading font-extrabold tracking-tight">{plan.price}</span>
                  <span className="text-[14px] text-gray-400 font-medium">/{plan.period}</span>
                </div>

                {/* CTA Button */}
                <Link
                  href="/login"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[14px] font-bold transition-all duration-300 ${plan.highlighted
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02]"
                      : plan.tier === "enterprise"
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-6" />

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-gray-300" />
                        </div>
                      )}
                      <span className={`text-[13px] leading-snug ${feature.included ? "text-gray-600" : "text-gray-300"}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom comparison note */}
        <div className={`mt-12 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {/* What's included in all plans */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200/60 p-6 sm:p-8 max-w-4xl mx-auto">
            <h4 className="text-[15px] font-heading font-bold text-center mb-5">Included in Every Plan</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                "16 AI Tools",
                "3 Languages",
                "Groq LLM",
                "Vapi Voice",
                "Deepgram STT",
                "6-Layer Security",
                "Live Transcript",
                "Lead Scoring",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="text-[12px] font-medium text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ style notes */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8 flex-wrap text-[12px] text-gray-400">
            <span>✦ No credit card for free plan</span>
            <span>✦ Cancel anytime</span>
            <span>✦ BYOK = unlimited calls on Pro</span>
            <span>✦ 14-day money back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    { q: "Does the student need to login or download anything?", a: "No! Students simply click the 'Call Now' button on your website and start talking. No login, no app download, no forms. It's completely frictionless — just like calling a phone number." },
    { q: "What languages does the AI support?", a: "Currently, our AI supports English, Urdu, and mixed Urdu-English (Urdlish). It automatically detects which language the caller is using and responds in the same language naturally." },
    { q: "How does the free plan work?", a: "The free plan gives you 3 calls per day with a 60-second time limit per call. It includes basic analytics, one AI assistant, and web call widget. No credit card required to start." },
    { q: "Can I use my own API keys?", a: "Yes! With the Pro plan, you can bring your own API keys for Vapi, OpenAI, Gemini, and other providers. This gives you full control over costs and lets you use your existing accounts." },
    { q: "How does the human handoff work?", a: "When the AI detects the caller is frustrated or requests a human, it smoothly transfers the call to your real receptionist. It also provides the direct phone number as a fallback." },
    { q: "Is our data secure?", a: "Absolutely. Each institution gets a fully isolated environment. All data is encrypted in transit and at rest. We use Supabase (built on PostgreSQL) with row-level security. We're working toward SOC 2 compliance." },
    { q: "Can we customize the AI's personality?", a: "Yes! Pro and Enterprise plans let you fully customize the AI's name, tone, greeting, knowledge base, and behavior. You can make it match your university's brand perfectly." },
    { q: "What happens when Vapi credits run out?", a: "Our Enterprise plan includes automatic provider fallback. If one provider's credits run out, the system automatically switches to a backup provider. Zero downtime, zero missed calls." },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`rounded-2xl transition-all duration-300 ${open ? "glass glow-sm" : "glass hover:bg-white/[0.03]"
                }`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="text-base font-medium pr-8">{faq.q}</span>
                <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${open
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-white/5 text-muted-foreground"
                        }`}
                >
                    {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                            {faq.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function FAQ() {
    return (
        <section id="faq" className="py-28 relative">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
                        FAQ
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight">
                        Common <span className="gradient-text">questions</span>
                    </h2>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} faq={faq} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
"use client";

import { motion } from "framer-motion";
import { MousePointer2, Mic, Database, BarChart3 } from "lucide-react";

const steps = [
    {
        step: "01",
        icon: MousePointer2,
        title: "Student Clicks \"Call Now\"",
        description: "A simple button on your website. No login, no download, no forms. One click and they're connected.",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        step: "02",
        icon: Mic,
        title: "AI Handles the Conversation",
        description: "Our AI speaks naturally in English, Urdu, or both. It answers questions, captures contacts, and books visits — like a real receptionist.",
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        step: "03",
        icon: Database,
        title: "Data Saved Automatically",
        description: "Names, phone numbers, appointments — everything is captured and stored in your dashboard without lifting a finger.",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        step: "04",
        icon: BarChart3,
        title: "Analyze & Improve",
        description: "View transcripts, track sentiment, identify common questions, and continuously improve your university's response quality.",
        gradient: "from-amber-500 to-orange-600",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-28 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
                        How It Works
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight">
                        Four steps to
                        <span className="gradient-text"> zero missed calls</span>
                    </h2>
                </motion.div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Connecting line */}
                    <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-violet-500/20 via-indigo-500/40 to-violet-500/20" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="relative text-center group"
                        >
                            {/* Step number */}
                            <div className="relative inline-flex mb-6">
                                <div
                                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10`}
                                >
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>
                                <div
                                    className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                                />
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-400 font-heading z-20">
                                    {step.step}
                                </div>
                            </div>

                            <h3 className="text-lg font-heading font-bold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
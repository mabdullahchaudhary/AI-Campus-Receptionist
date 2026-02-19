"use client";

import { motion } from "framer-motion";
import {
    Mic,
    Brain,
    Calendar,
    Users,
    Shield,
    Globe,
    BarChart3,
    Key,
    Headphones,
    Mail,
    Building2,
    Zap,
} from "lucide-react";

const features = [
    { icon: Mic, title: "One-Click Voice Calls", description: "Students click and instantly talk — no login, no app, zero friction.", gradient: "from-violet-500 to-purple-600" },
    { icon: Brain, title: "Context-Aware AI", description: "Remembers conversation flow and provides intelligent, relevant responses.", gradient: "from-blue-500 to-indigo-600" },
    { icon: Globe, title: "Multi-Language", description: "Auto-detects English, Urdu, or Urdlish and responds naturally.", gradient: "from-emerald-500 to-teal-600" },
    { icon: Calendar, title: "Smart Scheduling", description: "Books visits, creates calendar events, sends reminders automatically.", gradient: "from-amber-500 to-orange-600" },
    { icon: Users, title: "Auto Contact Capture", description: "Extracts names, phones, and emails from natural conversation.", gradient: "from-pink-500 to-rose-600" },
    { icon: Shield, title: "Spam Protection", description: "IP-based rate limiting and abuse detection with intelligent blocking.", gradient: "from-red-500 to-rose-600" },
    { icon: BarChart3, title: "Real-Time Analytics", description: "Live dashboard with sentiment analysis, call trends, and insights.", gradient: "from-cyan-500 to-blue-600" },
    { icon: Key, title: "Bring Your Own Keys", description: "Use your own API keys for full control and lower costs.", gradient: "from-yellow-500 to-amber-600" },
    { icon: Headphones, title: "Human Handoff", description: "Seamless transfer to real receptionist when needed.", gradient: "from-indigo-500 to-violet-600" },
    { icon: Mail, title: "Smart Follow-ups", description: "Auto-emails answers to unanswered questions after the call.", gradient: "from-teal-500 to-emerald-600" },
    { icon: Building2, title: "Multi-Tenant SaaS", description: "Each institution gets isolated environment and custom branding.", gradient: "from-purple-500 to-violet-600" },
    { icon: Zap, title: "Provider Fallback", description: "Auto-switches providers when credits run out. Zero downtime.", gradient: "from-orange-500 to-red-600" },
];

export default function Features() {
    return (
        <section id="features" className="py-28 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4"
                    >
                        Capabilities
                    </motion.span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight">
                        Everything to
                        <span className="gradient-text"> automate</span>
                        <br className="hidden sm:block" />
                        your reception
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
                        25+ enterprise features to handle every call, capture every lead,
                        and delight every visitor — fully autonomously.
                    </p>
                </motion.div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="group relative p-7 rounded-2xl glass card-shine hover:bg-white/[0.04] transition-all duration-500 glow-hover"
                        >
                            <div
                                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-500`}
                            >
                                <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-white transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Mic,
    ArrowRight,
    Play,
    Globe,
    Shield,
    Zap,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

function FloatingOrbs() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Primary orbs */}
            <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/5 blur-[150px]" />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--color-background)_70%)]" />
        </div>
    );
}

function AnimatedWave() {
    return (
        <div className="flex items-center gap-[3px] h-8">
            {[...Array(24)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-gradient-to-t from-violet-500 to-indigo-400"
                    animate={{
                        height: [8, 20 + Math.random() * 16, 8],
                    }}
                    transition={{
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        delay: i * 0.04,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-[72px]">
            <FloatingOrbs />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Announcement badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8 }}
                    >
                        <a
                            href="#features"
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Now with Multi-Language AI — English, Urdu & Urdlish</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </motion.div>

                    {/* Main heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="mt-8 text-[clamp(2.5rem,6vw,5rem)] font-heading font-extrabold leading-[1.05] tracking-tight"
                    >
                        Your University&apos;s
                        <br />
                        <span className="gradient-text">AI Voice Receptionist</span>
                    </motion.h1>

                    {/* Sub-heading */}
                    <motion.p
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                    >
                        Handle every admission call, schedule campus visits, and capture leads
                        — 24/7, autonomously. One AI agent that speaks your students&apos; language.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 glow group"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Free — No Card Required
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                        </Link>
                        <a href="#how-it-works">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2.5 px-8 py-4 text-base font-medium text-foreground glass rounded-2xl hover:bg-white/[0.06] transition-all duration-300"
                            >
                                <Play className="w-5 h-5 text-violet-400" />
                                Watch Demo
                            </motion.button>
                        </a>
                    </motion.div>

                    {/* Voice wave visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-16 flex justify-center"
                    >
                        <div className="glass rounded-3xl px-10 py-6 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 animate-pulse">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-medium text-foreground mb-1">
                                    AI Receptionist is listening...
                                </div>
                                <AnimatedWave />
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
                    >
                        {[
                            { value: "10K+", label: "Calls Handled", icon: Mic },
                            { value: "99.9%", label: "Uptime SLA", icon: Shield },
                            { value: "<750ms", label: "Response Time", icon: Zap },
                            { value: "2+", label: "Languages", icon: Globe },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="text-3xl sm:text-4xl font-heading font-bold gradient-text">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5">
                                    <stat.icon className="w-3.5 h-3.5 text-violet-400/60" />
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
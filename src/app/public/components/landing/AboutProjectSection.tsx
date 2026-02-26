"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, ArrowRight, Phone, Globe, Shield, Brain } from "lucide-react";
import Image from "next/image";

const stats = [
    { value: "50+", label: "Features Built" },
    { value: "16", label: "AI Tools" },
    { value: "24/7", label: "Availability" },
    { value: "<1s", label: "Response" },
];

export default function AboutProjectSection() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="about-project" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left — Visual Card */}
                    <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
                        <div className="relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[420px] shadow-xl group">
                            {/* Optimized Next.js Image for about-project.png */}
                            <Image
                                src="/about-project.png"
                                alt="Superior AI Project"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                priority
                                quality={90}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            {/* Fallback */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 -z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-gray-900/20" />

                            {/* Floating badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2.5">
                                {[
                                    { icon: Brain, label: "Groq LLM", color: "from-violet-500 to-indigo-600" },
                                    { icon: Mic, label: "Vapi Voice", color: "from-blue-500 to-cyan-600" },
                                    { icon: Shield, label: "6-Layer Security", color: "from-emerald-500 to-teal-600" },
                                ].map((badge, i) => (
                                    <div
                                        key={badge.label}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg"
                                        style={{ animationDelay: `${i * 200}ms` }}
                                    >
                                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                                            <badge.icon className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-[12px] font-semibold text-white/90">{badge.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom stats overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="grid grid-cols-4 gap-2">
                                    {stats.map((s) => (
                                        <div key={s.label} className="text-center bg-white/10 backdrop-blur-md rounded-xl py-3 border border-white/10">
                                            <p className="text-[18px] sm:text-[22px] font-heading font-extrabold text-white">{s.value}</p>
                                            <p className="text-[9px] sm:text-[10px] text-white/50 font-medium mt-0.5">{s.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Text Content */}
                    <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
                            About This Project
                        </span>

                        <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-heading font-extrabold tracking-tight leading-tight">
                            An Enterprise AI
                            <br />Voice Agent for
                            <br /><span className="gradient-text">Superior University</span>
                        </h2>

                        <p className="text-[15px] text-gray-500 mt-5 leading-relaxed">
                            Superior AI is a complete voice receptionist system built for Superior University, Lahore. It answers every call 24/7 handling admissions, fee inquiries, scholarship checks, campus visits, and 16 more tasks automatically.
                        </p>

                        <p className="text-[15px] text-gray-500 mt-3 leading-relaxed">
                            Powered by <span className="font-semibold text-gray-700">Groq&apos;s Llama 3.1</span> for fast AI responses, <span className="font-semibold text-gray-700">Vapi</span> for natural voice, and <span className="font-semibold text-gray-700">Deepgram</span> for accurate transcription all running on <span className="font-semibold text-gray-700">Next.js</span> with <span className="font-semibold text-gray-700">Supabase</span>.
                        </p>

                        {/* Key points */}
                        <div className="grid grid-cols-2 gap-3 mt-7">
                            {[
                                { icon: Phone, text: "Voice AI Calls" },
                                { icon: Globe, text: "3 Languages" },
                                { icon: Brain, text: "16 AI Tools" },
                                { icon: Shield, text: "Enterprise Security" },
                            ].map((point) => (
                                <div key={point.text} className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                        <point.icon className="w-4 h-4 text-violet-600" />
                                    </div>
                                    <span className="text-[13px] font-semibold text-gray-700">{point.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-3 mt-8">
                            <a
                                href="#features"
                                onClick={(e) => { e.preventDefault(); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[13.5px] font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300"
                            >
                                Explore Features <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-200 text-[13.5px] font-bold text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all duration-300 group"
                            >
                                How It Works
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all duration-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

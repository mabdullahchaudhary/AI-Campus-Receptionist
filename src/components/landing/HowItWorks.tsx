"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, Mic, Database, BarChart3, ArrowRight, Globe, Brain, Phone, Shield, Zap, BookOpen } from "lucide-react";
import Image from "next/image";

const steps = [
    {
        step: "01",
        icon: MousePointer2,
        title: "Student Clicks \"Call Now\"",
        desc: "A simple button on your website. No login, no download, no forms. One click and they're connected to Riley instantly.",
        gradient: "from-violet-500 to-indigo-600",
        details: ["Zero friction entry", "Works on any device", "No app download needed"],
        image: "/how-step-1.png",
    },
    {
        step: "02",
        icon: Mic,
        title: "Riley Handles the Call",
        desc: "Riley speaks naturally in English, Urdu, or Urdlish. Answers questions, captures contacts, books visits — like a real receptionist.",
        gradient: "from-blue-500 to-cyan-600",
        details: ["Auto language detection", "16 AI tools activated", "Sub-second response time"],
        image: "/how-step-2.png",
    },
    {
        step: "03",
        icon: Database,
        title: "Data Saved Automatically",
        desc: "Names, phone numbers, appointments, lead scores — everything captured and stored in your dashboard without lifting a finger.",
        gradient: "from-emerald-500 to-teal-600",
        details: ["Contact auto-saved to CRM", "Appointments auto-booked", "Lead score auto-calculated"],
        image: "/how-step-3.png",
    },
    {
        step: "04",
        icon: BarChart3,
        title: "Analyze & Improve",
        desc: "View full transcripts, track sentiments, identify common questions, and continuously improve your AI's response quality.",
        gradient: "from-amber-500 to-orange-600",
        details: ["Full call transcripts", "AI-generated summaries", "Tool usage analytics"],
        image: "/how-step-4.png",
    },
];

const systemFlow = [
    { icon: MousePointer2, label: "User Clicks Call", color: "bg-violet-500" },
    { icon: Shield, label: "6-Layer Security", color: "bg-red-500" },
    { icon: Phone, label: "Vapi Voice Connect", color: "bg-blue-500" },
    { icon: Brain, label: "Groq LLM Thinks", color: "bg-indigo-500" },
    { icon: BookOpen, label: "Knowledge Search", color: "bg-emerald-500" },
    { icon: Mic, label: "Riley Responds", color: "bg-violet-500" },
    { icon: Database, label: "Data Saved", color: "bg-teal-500" },
    { icon: BarChart3, label: "Analytics Updated", color: "bg-amber-500" },
];

export default function HowItWorksSection() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.06 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="how-it-works" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className={`text-center max-w-3xl mx-auto mb-14 sm:mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
                        How It Works
                    </span>
                    <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-heading font-extrabold tracking-tight leading-tight">
                        Four Steps to
                        <br className="hidden sm:block" /> <span className="gradient-text">Zero Missed Calls</span>
                    </h2>
                    <p className="text-[15px] text-gray-500 mt-3">From click to conversation to conversion — see how Riley works behind the scenes.</p>
                </div>

                {/* Steps — alternating layout */}
                <div className="space-y-6 sm:space-y-8">
                    {steps.map((step, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div
                                key={step.step}
                                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                                style={{ transitionDelay: `${200 + i * 150}ms` }}
                            >
                                {/* Image/Visual Side */}
                                <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                                    <div className="relative rounded-3xl overflow-hidden min-h-[240px] sm:min-h-[280px] shadow-xl group">
                                        {/* Optimized Next.js Image for step image */}
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                            quality={90}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                        />
                                        {/* Fallback gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-90 -z-10`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                                        {/* Step number overlay */}
                                        <div className="absolute top-6 left-6">
                                            <span className="text-[64px] sm:text-[80px] font-heading font-extrabold text-white/10 leading-none select-none">{step.step}</span>
                                        </div>

                                        {/* Icon center */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                                <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                            </div>
                                        </div>

                                        {/* Bottom label */}
                                        <div className="absolute bottom-5 left-6 right-6">
                                            <p className="text-white text-[14px] font-heading font-bold">Step {step.step}</p>
                                            <p className="text-white/60 text-[12px] mt-0.5">{step.title}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                                            <span className="text-white text-[14px] font-heading font-bold">{step.step}</span>
                                        </div>
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full" />
                                    </div>

                                    <h3 className="text-[20px] sm:text-[24px] font-heading font-extrabold">{step.title}</h3>
                                    <p className="text-[14px] text-gray-500 mt-3 leading-relaxed">{step.desc}</p>

                                    {/* Detail points */}
                                    <div className="mt-5 space-y-2.5">
                                        {step.details.map((detail) => (
                                            <div key={detail} className="flex items-center gap-2.5">
                                                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                                <span className="text-[13px] font-medium text-gray-600">{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* System Architecture Flow */}
                <div className={`mt-16 sm:mt-20 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="text-center mb-8">
                        <h3 className="text-[20px] sm:text-[24px] font-heading font-bold">Behind the Scenes</h3>
                        <p className="text-[13px] text-gray-400 mt-1">What happens in milliseconds when a caller connects</p>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-card overflow-hidden">
                        <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide">
                            {systemFlow.map((node, i) => (
                                <div key={node.label} className="flex items-center shrink-0">
                                    <div className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[100px]">
                                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${node.color} flex items-center justify-center shadow-lg`}>
                                            <node.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 text-center leading-tight">{node.label}</span>
                                    </div>
                                    {i < systemFlow.length - 1 && (
                                        <div className="flex items-center mx-1 sm:mx-2 -mt-5">
                                            <div className="w-6 sm:w-8 h-[2px] bg-gray-200 rounded-full" />
                                            <ArrowRight className="w-3 h-3 text-gray-300 -ml-1" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tech explanation */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                        {[
                            {
                                title: "Voice Layer",
                                desc: "Vapi connects the browser call → Deepgram transcribes in real-time → Groq LLM generates response → Vapi speaks back via Elliot voice",
                                gradient: "from-violet-600 to-indigo-600",
                            },
                            {
                                title: "Intelligence Layer",
                                desc: "16 tools auto-activate based on context → Knowledge base searched → Fee/scholarship/hostel data retrieved → Response formatted naturally",
                                gradient: "from-blue-600 to-cyan-600",
                            },
                            {
                                title: "Data Layer",
                                desc: "Contacts saved to CRM → Appointments booked → Leads scored → Call transcript stored → Analytics updated — all in Supabase",
                                gradient: "from-emerald-600 to-teal-600",
                            },
                        ].map((layer) => (
                            <div key={layer.title} className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card hover:shadow-card-hover transition-shadow">
                                <div className={`w-full h-1 rounded-full bg-gradient-to-r ${layer.gradient} mb-4`} />
                                <h4 className="text-[14px] font-heading font-bold">{layer.title}</h4>
                                <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">{layer.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={`mt-14 text-center transition-all duration-700 delay-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[14px] font-bold uppercase tracking-wide shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300"
                    >
                        Try Riley Free Now <ArrowRight className="w-4 h-4" />
                    </a>
                    <p className="text-[12px] text-gray-400 mt-3">No credit card • 2-min free calls • All 16 tools active</p>
                </div>
            </div>
        </section>
    );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, Phone, BookOpen, Shield, Globe, ArrowRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { images } from "@/lib/images";

// Tech stack SVG icons
function GroqIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><circle cx="12" cy="12" r="10" stroke="#F55036" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="#F55036" strokeWidth="2" strokeLinecap="round" /></svg>; }
function VapiIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><path d="M12 3v18M6 7l6-4 6 4M6 17l6 4 6-4" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function DeepgramIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><rect x="3" y="8" width="3" height="8" rx="1.5" fill="#13EF93" /><rect x="8" y="5" width="3" height="14" rx="1.5" fill="#13EF93" /><rect x="13" y="7" width="3" height="10" rx="1.5" fill="#13EF93" /><rect x="18" y="9" width="3" height="6" rx="1.5" fill="#13EF93" /></svg>; }
function SupabaseIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><path d="M13.5 21c-.3.4-.9.1-.9-.4V13h6.6c.6 0 .9-.7.5-1.1L11.5 3c-.3-.4-.9-.1-.9.4V11H4.1c-.6 0-.9.7-.5 1.1L11.5 21z" fill="#3ECF8E" /></svg>; }
function NextIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none"><circle cx="12" cy="12" r="10" fill="#000" /><path d="M9 8v8l7-5.5" fill="#fff" /></svg>; }

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <section id="hero" className="relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] max-w-[1000px] h-[40vh] sm:h-[600px] max-h-[600px] bg-gradient-to-b from-violet-50/60 via-indigo-50/30 to-transparent rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-6 lg:pt-8 pb-14 sm:pb-16">
                {/* Badge */}
                <div className={`flex justify-center mb-5 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200/60">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                        <span className="text-[13px] font-semibold text-violet-700">AI-Powered University Receptionist</span>
                    </div>
                </div>

                {/* Heading */}
                <div className={`text-center max-w-4xl mx-auto transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <h1 className="text-[34px] sm:text-[46px] lg:text-[56px] font-heading font-extrabold tracking-tight leading-[1.1]">
                        Meet <span className="gradient-text">Riley</span>, Your
                        <br className="hidden sm:block" />
                        {" "}University&apos;s AI Voice
                        <br className="hidden sm:block" />
                        {" "}Receptionist
                    </h1>
                </div>

                {/* Description */}
                <div className={`text-center max-w-2xl mx-auto mt-5 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed">
                        Handles admissions, fees, scholarships, campus visits &amp; more — 24/7 in English &amp; Urdu with 16 AI tools.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className={`flex items-center justify-center gap-3 sm:gap-4 mt-7 flex-wrap transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <Link href="/login" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[14px] font-bold uppercase tracking-wide shadow-xl shadow-violet-500/25 hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#about-project" onClick={(e) => { e.preventDefault(); document.getElementById("about-project")?.scrollIntoView({ behavior: "smooth" }); }} className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 text-[14px] font-bold uppercase tracking-wide text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all duration-300">
                        Learn More
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                </div>

                {/* Bottom: Left Image + Center Features + Right Image */}
                <div className={`mt-12 sm:mt-14 lg:mt-16 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center">

                        {/* Left Card */}
                        <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] shadow-xl group">
                            <Image
                                src={images.heroLeft}
                                alt="AI Voice Receptionist"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                priority
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            {/* Fallback gradient when no image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10" />
                            {/* Dark overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-gray-900/30" />

                            {/* Animated Voice Waveform */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-[3px]">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="voice-bar w-[3px] rounded-full" style={{ animationDelay: `${i * 0.07}s`, backgroundColor: i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#6366f1" : "#a78bfa" }} />
                                ))}
                            </div>

                            {/* Mic icon center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70px] w-14 h-14 rounded-full bg-violet-600/20 backdrop-blur-sm flex items-center justify-center border border-violet-400/30 animate-pulse">
                                <Mic className="w-6 h-6 text-violet-300" />
                            </div>

                            {/* Bottom content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center border-2 border-gray-800 z-30"><Mic className="w-4 h-4 text-white" /></div>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-gray-800 z-20"><Phone className="w-4 h-4 text-white" /></div>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border-2 border-gray-800 z-10"><Globe className="w-4 h-4 text-white" /></div>
                                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-800 text-[11px] font-bold text-gray-300">+16</div>
                                    </div>
                                </div>
                                <p className="text-white text-[15px] font-semibold">Riley AI — Active 24/7</p>
                                <p className="text-white/45 text-[13px] mt-0.5">Handling calls for Superior University</p>
                            </div>
                        </div>

                        {/* Center Features 2x2 */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-[320px]">
                            {[
                                { icon: Mic, label: "16 AI Tools", gradient: "from-violet-600 to-indigo-600" },
                                { icon: Shield, label: "24/7 Available", gradient: "from-emerald-600 to-teal-600" },
                                { icon: Globe, label: "Multi-Language", gradient: "from-blue-600 to-cyan-600" },
                                { icon: BookOpen, label: "Smart Training", gradient: "from-amber-600 to-orange-600" },
                            ].map((f) => (
                                <div key={f.label} className="flex items-center gap-3 px-4 py-4 sm:py-5 rounded-2xl bg-gray-900 text-white shadow-lg hover:scale-[1.03] transition-transform duration-300 cursor-default">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                                        <f.icon className="w-[18px] h-[18px] text-white" />
                                    </div>
                                    <span className="text-[13px] font-semibold leading-tight">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Right Card */}
                        <div className="relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[320px] shadow-xl group">
                            <img
                                src={images.heroRight}
                                alt="AI Call Demo"
                                className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                            {/* Fallback */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-indigo-50 to-violet-50 -z-10" />
                            {/* Light overlay for readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-white/20" />

                            <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                                {/* Animated play ring — smaller size */}
                                <div className="relative mb-4">
                                    <div className="absolute -inset-2 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full bg-violet-400/20 animate-ping" style={{ animationDuration: "2s" }} />
                                    <a href="#demo" onClick={(e) => { e.preventDefault(); document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }); }} className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-110 transition-all duration-300 z-10">
                                        <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" fill="white" />
                                    </a>
                                </div>
                                <p className="text-gray-800 text-[16px] font-heading font-bold">Try Live Demo</p>
                                <p className="text-gray-400 text-[13px] mt-0.5">Talk to Riley right now</p>

                                {/* Chat bubbles */}
                                <div className="mt-5 w-full max-w-[230px] space-y-2.5 px-4">
                                    <div className="flex justify-end"><div className="px-3.5 py-2 rounded-2xl rounded-br-sm bg-violet-600 text-white text-[12px] shadow-sm">BS CS ki fee kitni hai?</div></div>
                                    <div className="flex justify-start"><div className="px-3.5 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-gray-700 text-[12px] shadow-sm">PKR 285,000/year hai...</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tech Stack — with actual icons */}
                <div className={`mt-14 sm:mt-16 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <p className="text-center text-[12px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-7">Powered By Leading AI Technology</p>
                    <div className="flex items-center justify-center gap-10 sm:gap-14 flex-wrap">
                        {[
                            { name: "Groq", icon: <GroqIcon /> },
                            { name: "Vapi", icon: <VapiIcon /> },
                            { name: "Deepgram", icon: <DeepgramIcon /> },
                            { name: "Supabase", icon: <SupabaseIcon /> },
                            { name: "Next.js", icon: <NextIcon /> },
                        ].map((tech) => (
                            <div key={tech.name} className="flex items-center gap-2.5 group cursor-default hover:scale-105 transition-transform duration-300">
                                <div className="w-9 h-9 rounded-xl bg-white border border-gray-200/80 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-gray-300 transition-all">
                                    {tech.icon}
                                </div>
                                <span className="text-[14px] font-bold text-gray-600 group-hover:text-gray-800 transition-colors">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Voice bar animation */}
            <style jsx>{`
                .voice-bar {
                    height: 20px;
                    animation: voiceWave 1s ease-in-out infinite alternate;
                }
                @keyframes voiceWave {
                    0% { height: 8px; opacity: 0.4; }
                    50% { height: 32px; opacity: 0.9; }
                    100% { height: 14px; opacity: 0.5; }
                }
            `}</style>
        </section>
    );
}
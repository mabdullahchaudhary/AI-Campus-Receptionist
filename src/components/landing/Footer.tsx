"use client";

import { useEffect, useState } from "react";
import { Mic, Github, Mail, Heart, ArrowRight, Phone, MapPin, ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const [emailCopied, setEmailCopied] = useState(false);
    const [phoneCopied, setPhoneCopied] = useState(false);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const copyToClipboard = (text: string, type: "email" | "phone") => {
        navigator.clipboard.writeText(text);
        if (type === "email") { setEmailCopied(true); setTimeout(() => setEmailCopied(false), 2000); }
        if (type === "phone") { setPhoneCopied(true); setTimeout(() => setPhoneCopied(false), 2000); }
    };

    return (
        <footer className="relative">

            {/* Gradient divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            {/* Top CTA Strip */}
            <div className="bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-violet-600/10 backdrop-blur-sm border-b border-gray-200/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="text-[14px] font-semibold text-gray-700">Start automating your university reception today</span>
                    </div>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[13px] font-bold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
                    >
                        Get Started Free
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-8">

                    {/* Top Row — Brand + Newsletter-style contact */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-10 pb-12 border-b border-gray-100">
                        {/* Brand */}
                        <div className="max-w-md">
                            <Link href="/" className="inline-flex items-center gap-2.5 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-violet-500/20 group-hover:scale-105 transition-all duration-300">
                                    <Mic className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="text-[20px] font-heading font-extrabold text-gray-900 tracking-tight">
                                        Superior<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600"> AI</span>
                                    </span>
                                    <p className="text-[10px] text-gray-400 -mt-0.5 font-medium">AI Voice Receptionist</p>
                                </div>
                            </Link>
                            <p className="text-[14px] text-gray-500 mt-4 leading-relaxed">
                                Enterprise AI voice receptionist built for Superior University, Lahore. 50+ features, 16 AI tools, 3 languages, 6-layer security — handling every call 24/7.
                            </p>
                        </div>

                        {/* Direct Contact */}
                        <div className="flex flex-col sm:flex-row items-start gap-3">
                            <button
                                onClick={() => copyToClipboard("info@superior.edu.pk", "email")}
                                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 hover:bg-violet-50 border border-gray-200/60 hover:border-violet-200 transition-all duration-300 group"
                            >
                                <Mail className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
                                <div className="text-left">
                                    <p className="text-[13px] font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">
                                        {emailCopied ? "Copied! ✓" : "info@superior.edu.pk"}
                                    </p>
                                    <p className="text-[10px] text-gray-400">Click to copy</p>
                                </div>
                            </button>
                            <button
                                onClick={() => copyToClipboard("04235761999", "phone")}
                                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 hover:bg-violet-50 border border-gray-200/60 hover:border-violet-200 transition-all duration-300 group"
                            >
                                <Phone className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition-colors" />
                                <div className="text-left">
                                    <p className="text-[13px] font-semibold text-gray-700 group-hover:text-violet-700 transition-colors">
                                        {phoneCopied ? "Copied! ✓" : "042-35761999"}
                                    </p>
                                    <p className="text-[10px] text-gray-400">Click to copy</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Links Grid — 6 columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 py-12">

                        {/* Navigate */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">Navigate</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "Home", href: "#hero" },
                                    { name: "About", href: "#about-project" },
                                    { name: "Features", href: "#features" },
                                    { name: "Pricing", href: "#pricing" },
                                    { name: "How It Works", href: "#how-it-works" },
                                    { name: "FAQ", href: "#faq" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <a href={l.href} onClick={(e) => handleScroll(e, l.href)} className="text-[13px] text-gray-500 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-1 group">
                                            <span className="w-0 group-hover:w-1.5 h-[2px] bg-violet-500 rounded-full transition-all duration-200" />
                                            {l.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Dashboard */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">Dashboard</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "Overview", href: "/dashboard" },
                                    { name: "Make a Call", href: "/dashboard/call" },
                                    { name: "Call History", href: "/dashboard/calls" },
                                    { name: "Knowledge Base", href: "/dashboard/knowledge" },
                                    { name: "Billing", href: "/dashboard/billing" },
                                    { name: "Settings", href: "/dashboard/settings" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <Link href={l.href} className="text-[13px] text-gray-500 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-1 group">
                                            <span className="w-0 group-hover:w-1.5 h-[2px] bg-violet-500 rounded-full transition-all duration-200" />
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* AI Tools */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">AI Tools</h4>
                            <ul className="space-y-2.5">
                                {[
                                    "Knowledge Search",
                                    "Fee Calculator",
                                    "Scholarship Check",
                                    "Campus Visit Booking",
                                    "Contact Saver",
                                    "Lead Scoring",
                                    "Callback Scheduler",
                                    "Human Transfer",
                                ].map((t) => (
                                    <li key={t}>
                                        <span className="text-[13px] text-gray-400 cursor-default">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Powered By — with real links */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">Powered By</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "Next.js", href: "https://nextjs.org", color: "bg-gray-900" },
                                    { name: "Groq AI", href: "https://groq.com", color: "bg-red-500" },
                                    { name: "Vapi", href: "https://vapi.ai", color: "bg-violet-600" },
                                    { name: "Deepgram", href: "https://deepgram.com", color: "bg-green-500" },
                                    { name: "Supabase", href: "https://supabase.com", color: "bg-emerald-600" },
                                    { name: "Vercel", href: "https://vercel.com", color: "bg-gray-900" },
                                    { name: "n8n", href: "https://n8n.io", color: "bg-orange-500" },
                                    { name: "Tailwind CSS", href: "https://tailwindcss.com", color: "bg-cyan-500" },
                                ].map((t) => (
                                    <li key={t.name}>
                                        <a href={t.href} target="_blank" rel="noreferrer" className="text-[13px] text-gray-500 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-2 group">
                                            <span className={`w-1.5 h-1.5 rounded-full ${t.color} shrink-0`} />
                                            {t.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">Company</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "Our Team", href: "#team" },
                                    { name: "Contact", href: "#contact" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <a href={l.href} onClick={(e) => handleScroll(e, l.href)} className="text-[13px] text-gray-500 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-1 group">
                                            <span className="w-0 group-hover:w-1.5 h-[2px] bg-violet-500 rounded-full transition-all duration-200" />
                                            {l.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mt-6 mb-4">University</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "Official Website", href: "https://www.superior.edu.pk" },
                                    { name: "Admissions", href: "https://www.superior.edu.pk/admissions" },
                                    { name: "Fee Structure", href: "https://www.superior.edu.pk/fee-structure" },
                                    { name: "Scholarships", href: "https://www.superior.edu.pk/scholarships" },
                                ].map((l) => (
                                    <li key={l.name}>
                                        <a href={l.href} target="_blank" rel="noreferrer" className="text-[13px] text-gray-500 hover:text-violet-600 transition-colors duration-200 inline-flex items-center gap-1 group">
                                            {l.name}
                                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] mb-4">Connect</h4>

                            <a
                                href="https://github.com/abdullahchaudhary-webdev"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-900 border border-gray-200/60 hover:border-gray-900 transition-all duration-300 group mb-3"
                            >
                                <Github className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                <div>
                                    <p className="text-[12px] font-semibold text-gray-700 group-hover:text-white transition-colors">GitHub</p>
                                    <p className="text-[10px] text-gray-400 group-hover:text-gray-400 transition-colors">View source code</p>
                                </div>
                            </a>

                            <a
                                href="mailto:info@superior.edu.pk"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-violet-600 border border-gray-200/60 hover:border-violet-600 transition-all duration-300 group mb-3"
                            >
                                <Mail className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                <div>
                                    <p className="text-[12px] font-semibold text-gray-700 group-hover:text-white transition-colors">Email Us</p>
                                    <p className="text-[10px] text-gray-400 group-hover:text-violet-200 transition-colors">info@superior.edu.pk</p>
                                </div>
                            </a>

                            <a
                                href="https://maps.google.com/?q=Superior+University+Lahore"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-emerald-600 border border-gray-200/60 hover:border-emerald-600 transition-all duration-300 group"
                            >
                                <MapPin className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                                <div>
                                    <p className="text-[12px] font-semibold text-gray-700 group-hover:text-white transition-colors">Visit Campus</p>
                                    <p className="text-[10px] text-gray-400 group-hover:text-emerald-200 transition-colors">Get directions</p>
                                </div>
                            </a>

                            {/* Project stats */}
                            <div className="mt-5 pt-5 border-t border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Project Stats</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { v: "50+", l: "Features" },
                                        { v: "16", l: "AI Tools" },
                                        { v: "12", l: "APIs" },
                                        { v: "16", l: "DB Tables" },
                                    ].map((s) => (
                                        <div key={s.l} className="text-center py-2 rounded-lg bg-gray-50">
                                            <p className="text-[14px] font-heading font-extrabold text-gray-800">{s.v}</p>
                                            <p className="text-[9px] text-gray-400 font-medium">{s.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-[12px] text-gray-400 flex-wrap justify-center">
                            <span>© 2026 Superior AI</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>Superior University, Lahore</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <a href="/legal/terms" className="hover:text-violet-600 underline underline-offset-2 decoration-dotted">Terms</a>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <a href="/legal/privacy" className="hover:text-violet-600 underline underline-offset-2 decoration-dotted">Privacy</a>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>All rights reserved</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                            Crafted with
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                            by
                            <a href="#team" onClick={(e) => handleScroll(e, "#team")} className="font-semibold text-gray-600 hover:text-violet-600 transition-colors underline decoration-dotted underline-offset-2 decoration-gray-300 hover:decoration-violet-400">
                                6 students from Superior University
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
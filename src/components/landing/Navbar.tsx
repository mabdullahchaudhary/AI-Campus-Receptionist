"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Mic, ArrowRight, Menu, X } from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    sectionId: string;
}

const navItems: NavItem[] = [
    { name: "Home", href: "/#hero", sectionId: "hero" },
    { name: "About Project", href: "/#about-project", sectionId: "about-project" },
    { name: "Capabilities", href: "/#features", sectionId: "features" },
    { name: "Pricing", href: "/#pricing", sectionId: "pricing" },
    { name: "Working", href: "/#how-it-works", sectionId: "how-it-works" },
    { name: "Team", href: "/#team", sectionId: "team" },
    { name: "FAQ", href: "/#faq", sectionId: "faq" },
    { name: "Contact", href: "/#contact", sectionId: "contact" },
];

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [visible, setVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");
    const lastScrollY = useRef(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 10);

            if (currentY > lastScrollY.current && currentY > 100) {
                setVisible(false);
            } else {
                setVisible(true);
            }

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => setVisible(true), 150);
            lastScrollY.current = currentY;

            const sections = navItems.map((item) => document.getElementById(item.sectionId)).filter(Boolean);
            let current = "hero";
            for (const section of sections) {
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 120) current = section.id;
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setMobileOpen(false);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${visible ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3.5">
                    <div className={`flex items-center justify-between h-[64px] sm:h-[68px] px-5 sm:px-6 rounded-2xl transition-all duration-500 ${scrolled ? "bg-white/75 backdrop-blur-2xl border border-gray-200/50 shadow-[0_2px_24px_rgba(0,0,0,0.07)]" : "bg-white/55 backdrop-blur-xl border border-gray-200/30 shadow-[0_1px_12px_rgba(0,0,0,0.03)]"}`}>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-all duration-300 group-hover:scale-105">
                                <Mic className="w-[18px] h-[18px] text-white" />
                            </div>
                            <span className="text-[18px] font-heading font-extrabold tracking-tight">
                                Superior<span className="gradient-text"> AI</span>
                            </span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.sectionId;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleSmoothScroll(e, item.sectionId)}
                                        className={`relative px-4 py-2 rounded-xl text-[14px] transition-all duration-300 ${isActive ? "text-violet-700 font-bold bg-violet-50/80" : "text-gray-500 font-medium hover:text-gray-800 hover:bg-gray-50/60"}`}
                                    >
                                        {item.name}
                                        <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-600 transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
                                    </a>
                                );
                            })}
                        </div>

                        {/* CTA + Mobile */}
                        <div className="flex items-center gap-3">
                            <Link href={session ? "/dashboard" : "/login"} className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-[13.5px] font-semibold hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md group">
                                {session ? "Dashboard" : "Get Started"}
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </Link>
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-gray-100/80 hover:bg-gray-200/80 flex items-center justify-center transition-all duration-200">
                                <Menu className="w-[18px] h-[18px] text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${mobileOpen ? "visible" : "invisible pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-black/15 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMobileOpen(false)} />

                <div className={`absolute top-3 right-3 left-3 bg-white/92 backdrop-blur-2xl rounded-2xl border border-gray-200/50 shadow-2xl shadow-gray-900/10 transform transition-all duration-400 ease-out origin-top ${mobileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100/60">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                                <Mic className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-[16px] font-heading font-extrabold">Superior<span className="gradient-text"> AI</span></span>
                        </Link>
                        <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-xl bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center transition-colors">
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    <div className="px-3 py-3 space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.sectionId;
                            return (
                                <a key={item.name} href={item.href} onClick={(e) => handleSmoothScroll(e, item.sectionId)} className={`flex items-center px-4 py-3.5 rounded-xl text-[15px] transition-all duration-200 ${isActive ? "text-violet-700 font-bold bg-violet-50/80" : "text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50/60"}`}>
                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-violet-600 mr-3 shrink-0" />}
                                    {item.name}
                                </a>
                            );
                        })}
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-gray-100/60">
                        <Link href={session ? "/dashboard" : "/login"} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-xl bg-gray-900 text-white text-[14.5px] font-semibold hover:bg-gray-800 transition-all">
                            {session ? "Go to Dashboard" : "Get Started Free"}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="h-[88px]" />
        </>
    );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Menu, X, ArrowRight, ChevronDown } from "lucide-react";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-soft" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-[72px]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                        </motion.div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold font-heading tracking-tight leading-none">
                                Superior<span className="gradient-text"> AI</span>
                            </span>
                            <span className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none mt-0.5">
                                Voice Receptionist
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full group-hover:w-3/4 transition-all duration-300" />
                            </a>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 px-4 py-2">
                            Log in
                        </Link>
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-violet-500/20"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </div>

                    <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden glass-strong border-t border-border"
                    >
                        <div className="px-6 py-6 space-y-1">
                            {navLinks.map((link, i) => (
                                <motion.a key={link.name} href={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3 text-base text-muted-foreground hover:text-foreground transition-colors">
                                    {link.name}
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                </motion.a>
                            ))}
                            <div className="pt-4 mt-4 border-t border-border space-y-3">
                                <Link href="/login" className="block text-center py-2.5 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Log in</Link>
                                <Link href="/login" className="block text-center py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
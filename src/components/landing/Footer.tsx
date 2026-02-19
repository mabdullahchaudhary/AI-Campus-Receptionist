"use client";

import { Mic, Github, Twitter, Linkedin, Instagram, Mail, Heart } from "lucide-react";
import Link from "next/link";

const footerSections = {
    Product: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "How it Works", href: "#how-it-works" },
        { name: "FAQ", href: "#faq" },
        { name: "Changelog", href: "#" },
    ],
    Company: [
        { name: "About", href: "#team" },
        { name: "Team", href: "#team" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
    ],
    Legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
    ],
    Support: [
        { name: "Help Center", href: "#" },
        { name: "Documentation", href: "#" },
        { name: "API Reference", href: "#" },
        { name: "Status", href: "#" },
    ],
};

const socials = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "mailto:hello@superiorai.com", label: "Email" },
];

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background/80">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main footer */}
                <div className="py-16 grid grid-cols-2 md:grid-cols-6 gap-10">
                    {/* Brand column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-heading font-bold">
                                    Superior<span className="gradient-text"> AI</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xs">
                            Enterprise AI voice receptionist for universities.
                            Built with passion by students in Lahore, Pakistan.
                        </p>
                        <div className="flex items-center gap-2 mt-6">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-violet-500/20 hover:text-violet-400 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerSections).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-heading font-semibold mb-4 text-foreground">
                                {title}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 Superior AI. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        Crafted with <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> in Lahore, Pakistan
                    </p>
                </div>
            </div>
        </footer>
    );
}
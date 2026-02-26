"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, ArrowUpRight } from "lucide-react";

const contactCards = [
    {
        icon: Phone,
        label: "Call Us",
        value: "042-35761999",
        sub: "Mon–Sat, 9 AM – 5 PM",
        href: "tel:04235761999",
        gradient: "from-violet-500 to-indigo-600",
    },
    {
        icon: Mail,
        label: "Email Us",
        value: "info@superior.edu.pk",
        sub: "Reply within 24 hours",
        href: "mailto:info@superior.edu.pk",
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        icon: MapPin,
        label: "Visit Us",
        value: "17-KM Raiwind Road, Lahore",
        sub: "Superior University Campus",
        href: "https://maps.google.com/?q=Superior+University+Lahore",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        icon: Clock,
        label: "Working Hours",
        value: "Monday – Saturday",
        sub: "9:00 AM – 5:00 PM PKT",
        href: null,
        gradient: "from-amber-500 to-orange-600",
    },
];

export default function ContactSection() {
    const [visible, setVisible] = useState(false);
    const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent">("idle");
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.08 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("sending");
        setTimeout(() => {
            setFormStatus("sent");
            setForm({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setFormStatus("idle"), 3000);
        }, 1500);
    };

    return (
        <section id="contact" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
                        Get In Touch
                    </span>
                    <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-heading font-extrabold tracking-tight leading-tight">
                        Let&apos;s <span className="gradient-text">Connect</span>
                    </h2>
                    <p className="text-[15px] text-gray-500 mt-3">Have questions about Superior AI? Want a live demo? Reach out — we respond fast.</p>
                </div>

                {/* Contact Cards Row */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                    {contactCards.map((card) => {
                        const Wrapper = card.href ? "a" : "div";
                        const wrapperProps = card.href ? {
                            href: card.href,
                            target: card.href.startsWith("http") ? "_blank" : undefined,
                            rel: card.href.startsWith("http") ? "noreferrer" : undefined,
                        } : {};

                        return (
                            <Wrapper
                                key={card.label}
                                {...wrapperProps}
                                className="group relative bg-white rounded-2xl border border-gray-200/60 p-5 sm:p-6 shadow-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-violet-200 hover:-translate-y-1"
                            >
                                {/* Hover gradient bg */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                                            <card.icon className="w-5 h-5 text-white" />
                                        </div>
                                        {card.href && (
                                            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                                        )}
                                    </div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                    <p className="text-[14px] font-semibold text-gray-800 mt-1 group-hover:text-violet-700 transition-colors duration-300 truncate">{card.value}</p>
                                    <p className="text-[11px] text-gray-400 mt-0.5">{card.sub}</p>
                                </div>
                            </Wrapper>
                        );
                    })}
                </div>

                {/* Form + Map Row */}
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl border border-gray-200/60 p-6 sm:p-8 shadow-card hover:shadow-xl transition-shadow duration-500">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                <Send className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-heading font-bold">Send a Message</h3>
                                <p className="text-[11px] text-gray-400">We reply within 24 hours</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name + Email row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block transition-colors duration-200 ${focusedField === "name" ? "text-violet-600" : "text-gray-400"}`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        onFocus={() => setFocusedField("name")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Your name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] transition-all duration-200 placeholder:text-gray-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 focus:shadow-lg focus:shadow-violet-500/5 hover:border-gray-300"
                                        suppressHydrationWarning
                                    />
                                </div>
                                <div>
                                    <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block transition-colors duration-200 ${focusedField === "email" ? "text-violet-600" : "text-gray-400"}`}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] transition-all duration-200 placeholder:text-gray-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 focus:shadow-lg focus:shadow-violet-500/5 hover:border-gray-300"
                                        suppressHydrationWarning
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block transition-colors duration-200 ${focusedField === "subject" ? "text-violet-600" : "text-gray-400"}`}>
                                    Subject
                                </label>
                                <select
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    onFocus={() => setFocusedField("subject")}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] transition-all duration-200 text-gray-600 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 focus:shadow-lg focus:shadow-violet-500/5 hover:border-gray-300 appearance-none cursor-pointer"
                                    suppressHydrationWarning
                                    // Removed SSR-incompatible style prop to fix hydration mismatch
                                >
                                    <option value="">Select a topic</option>
                                    <option value="demo">Request a Demo</option>
                                    <option value="pricing">Pricing Question</option>
                                    <option value="technical">Technical Support</option>
                                    <option value="partnership">Partnership Inquiry</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 block transition-colors duration-200 ${focusedField === "message" ? "text-violet-600" : "text-gray-400"}`}>
                                    Message
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    onFocus={() => setFocusedField("message")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Tell us how we can help..."
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] transition-all duration-200 resize-none placeholder:text-gray-300 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 focus:shadow-lg focus:shadow-violet-500/5 hover:border-gray-300"
                                    suppressHydrationWarning
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formStatus === "sending"}
                                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-300 group ${formStatus === "sent"
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/25 hover:scale-[1.01] active:scale-[0.99]"
                                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                            >
                                {formStatus === "idle" && (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                    </>
                                )}
                                {formStatus === "sending" && (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                )}
                                {formStatus === "sent" && <>✓ Message Sent Successfully</>}
                            </button>

                            <p className="text-[10px] text-gray-400 text-center">🔒 Your information is secure and never shared with third parties</p>
                        </form>
                    </div>

                    {/* Right — Map + CTA */}
                    <div className="space-y-5">
                        {/* Map */}
                        <div className="bg-white rounded-3xl border border-gray-200/60 overflow-hidden shadow-card hover:shadow-xl transition-shadow duration-500 group">
                            <div className="relative h-[240px] sm:h-[280px] bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3407.123!2d74.123!3d31.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSuperior+University!5e0!3m2!1sen!2spk"
                                    className="absolute inset-0 w-full h-full border-0 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Superior University Location"
                                />
                                <div className="absolute inset-0 flex items-center justify-center -z-10">
                                    <div className="text-center">
                                        <MapPin className="w-10 h-10 text-violet-300 mx-auto mb-3" />
                                        <p className="text-[14px] font-semibold text-gray-500">Superior University</p>
                                        <p className="text-[12px] text-gray-400">17-KM Raiwind Road, Lahore</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[14px] font-heading font-bold">Superior University</p>
                                    <p className="text-[12px] text-gray-400 mt-0.5">17-KM Raiwind Road, Lahore, Pakistan</p>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=Superior+University+Lahore"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 text-[12px] font-bold hover:bg-violet-100 transition-colors shrink-0"
                                >
                                    <MapPin className="w-3.5 h-3.5" /> Get Directions
                                </a>
                            </div>
                        </div>

                        {/* CTA card */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/10 transition-colors duration-500" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                            <div className="relative z-10">
                                <p className="text-white text-[18px] font-heading font-bold">Want to see Riley in action?</p>
                                <p className="text-white/40 text-[13px] mt-1.5 leading-relaxed">Try a free AI voice call right now — no signup needed for the demo. Experience how Riley handles admissions, fees, and campus inquiries.</p>
                                <div className="flex items-center gap-3 mt-5 flex-wrap">
                                    <a
                                        href="/login"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[13px] font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 hover:scale-[1.02] transition-all duration-300"
                                    >
                                        Try Free Demo
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                    <a
                                        href="tel:04235761999"
                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/10 text-white text-[13px] font-bold hover:bg-white/15 transition-all duration-300"
                                    >
                                        <Phone className="w-4 h-4" /> Call Directly
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
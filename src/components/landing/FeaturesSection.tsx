"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Brain, Calendar, Users, Shield, Globe, BarChart3, Key, Headphones, Zap, Phone, BookOpen, ArrowRight } from "lucide-react";

const capabilities = [
  {
    icon: Mic,
    title: "One-Click Voice Calls",
    desc: "Students click and instantly talk to Riley — no login, no app download, zero friction.",
    gradient: "from-violet-500 to-indigo-600",
  },
  {
    icon: Brain,
    title: "Context-Aware AI",
    desc: "Remembers conversation flow, searches knowledge base, and gives intelligent responses.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Globe,
    title: "Auto Language Detection",
    desc: "Detects English, Urdu, or Urdlish from the first sentence and responds naturally.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Books campus visits, creates appointments, and tracks them — all from voice commands.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Auto Contact Capture",
    desc: "Extracts names, phones, emails from natural conversation. Never asks all at once.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Shield,
    title: "Fraud & Spam Protection",
    desc: "IP rate limiting, device fingerprinting, and 6-layer verification blocks abuse.",
    gradient: "from-red-500 to-rose-600",
  },
  {
    icon: BarChart3,
    title: "Live Analytics Dashboard",
    desc: "Real-time stats — call duration, sentiment analysis, tool usage, and lead trends.",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    icon: Key,
    title: "Bring Your Own Keys",
    desc: "Add your Vapi and Groq API keys for unlimited usage with full cost control.",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    icon: Headphones,
    title: "Human Handoff",
    desc: "Seamless transfer to real receptionist when caller is frustrated or requests human.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: Phone,
    title: "Callback Scheduling",
    desc: "Caller requests a follow-up? Riley schedules it with name, time, and reason.",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Trainable Knowledge Base",
    desc: "Full CRUD — add, edit, delete, toggle entries. Riley learns your data instantly.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Zap,
    title: "Provider Auto-Switch",
    desc: "Credits run out? Automatically switches to next account. Zero downtime guaranteed.",
    gradient: "from-orange-500 to-red-600",
  },
];

export default function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={ref} className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-16">

          {/* Left — Sticky heading */}
          <div className={`lg:sticky lg:top-32 lg:self-start transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
              Capabilities
            </span>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-heading font-extrabold tracking-tight leading-tight">
              Some Call It
              <br />Magic, We Call It
              <br /><span className="gradient-text">Riley AI</span>
            </h2>
            <p className="text-[15px] text-gray-500 mt-4 leading-relaxed max-w-sm">
              12 enterprise capabilities that handle every call, capture every lead, and delight every visitor — fully autonomously.
            </p>
            <a
              href="#pricing"
              onClick={(e) => { e.preventDefault(); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border-2 border-gray-200 text-[13.5px] font-bold text-gray-700 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-all duration-300 group"
            >
              View Pricing
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all duration-300" />
            </a>
          </div>

          {/* Right — Numbered cards grid */}
          <div>
            {/* Top accent line */}
            <div className={`h-[3px] w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-transparent rounded-full mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 scale-x-100 origin-left" : "opacity-0 scale-x-0"}`} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {capabilities.map((cap, i) => (
                <div
                  key={cap.title}
                  className={`relative bg-white rounded-2xl border border-gray-200/60 p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-violet-200 transition-all duration-300 group overflow-hidden ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${150 + i * 60}ms` }}
                >
                  {/* Large number watermark */}
                  <span className="absolute bottom-2 right-4 text-[72px] sm:text-[80px] font-heading font-extrabold text-gray-100 leading-none select-none pointer-events-none group-hover:text-violet-50 transition-colors duration-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div className={`relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <cap.icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative z-10 text-[15px] font-heading font-bold group-hover:text-violet-700 transition-colors duration-300">{cap.title}</h3>
                  <p className="relative z-10 text-[12.5px] text-gray-400 mt-1.5 leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
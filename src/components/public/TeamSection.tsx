"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Code2, Palette, Layout, Brain, Megaphone, Server, ArrowRight, Sparkles } from "lucide-react";

const team = [
  {
    name: "Abdullah",
    role: "Project Lead",
    tag: "Full-Stack + AI",
    task: "Architecture, Vapi & Groq integration, admin dashboard, provider rotation",
    icon: Code2,
    gradient: "from-violet-500 to-indigo-600",
    shadow: "shadow-violet-500/20",
    github: "https://github.com/abdullahchaudhary-webdev",
    emoji: "🚀",
    number: "01",
  },
  {
    name: "Hamid",
    role: "Backend Developer",
    tag: "APIs + Database",
    task: "Supabase schema, API routes, n8n workflows, security layers",
    icon: Server,
    gradient: "from-blue-500 to-cyan-600",
    shadow: "shadow-blue-500/20",
    github: "#",
    emoji: "⚡",
    number: "02",
  },
  {
    name: "Arooj",
    role: "UI/UX Designer",
    tag: "Design + Branding",
    task: "Landing page design, dashboard layouts, responsive design, color system",
    icon: Palette,
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
    github: "#",
    emoji: "🎨",
    number: "03",
  },
  {
    name: "Amara",
    role: "Frontend Developer",
    tag: "React + Next.js",
    task: "Dashboard pages, call UI, knowledge base, billing & settings pages",
    icon: Layout,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    github: "#",
    emoji: "💻",
    number: "04",
  },
  {
    name: "Mehwish",
    role: "AI Training Lead",
    tag: "Content + Prompts",
    task: "Knowledge base data, system prompts, Riley personality, QA testing",
    icon: Brain,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
    github: "#",
    emoji: "🧠",
    number: "05",
  },
  {
    name: "Zari",
    role: "Marketing & Docs",
    tag: "Strategy + Presentation",
    task: "Project documentation, demo prep, feature writeups, user testing",
    icon: Megaphone,
    gradient: "from-red-500 to-rose-600",
    shadow: "shadow-red-500/20",
    github: "#",
    emoji: "📢",
    number: "06",
  },
];

export default function TeamSection() {
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" ref={ref} className="py-16 sm:py-20 lg:py-24 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-14 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
            Our Team
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-heading font-extrabold tracking-tight leading-tight">
            6 Students, 1 Mission:
            <br className="hidden sm:block" /> <span className="gradient-text">Zero Missed Calls</span>
          </h2>
          <p className="text-[15px] text-gray-500 mt-3">A university project turned enterprise AI — built with code, creativity, and way too much caffeine ☕</p>
        </div>

        {/* Featured Lead Card */}
        <div className={`mb-6 transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden group"
            onMouseEnter={() => setHoveredIndex(-1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl sm:text-4xl font-heading font-extrabold text-white shadow-2xl shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
                  A
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                  <span className="text-sm">🚀</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white text-[20px] sm:text-[22px] font-heading font-extrabold">Abdullah</h3>
                  <span className="px-2.5 py-0.5 rounded-lg bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-wider">Project Lead</span>
                </div>
                <p className="text-white/40 text-[13px] mt-1 font-medium">Full-Stack Developer + AI Integration</p>
                <p className="text-white/30 text-[13px] mt-2 leading-relaxed max-w-xl">
                  System architecture, Vapi & Groq AI setup, admin dashboard, provider rotation, 16 tools integration, security layers — the one who built it all together.
                </p>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/mabdullahchaudhary"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-white shrink-0"
              >
                <Github className="w-4 h-4" />
                <span className="text-[12px] font-semibold">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Rest of Team — 5 cards in creative grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {team.slice(1).map((member, i) => (
            <div
              key={member.name}
              className={`relative bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 group cursor-default ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Top gradient bar */}
              <div className={`h-1 bg-gradient-to-r ${member.gradient}`} />

              <div className="p-5">
                {/* Number watermark */}
                <span className="absolute top-3 right-4 text-[48px] font-heading font-extrabold text-gray-50 leading-none select-none pointer-events-none group-hover:text-violet-50 transition-colors">
                  {member.number}
                </span>

                {/* Icon + Emoji */}
                <div className="relative z-10 flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg ${member.shadow} group-hover:scale-110 transition-transform duration-300`}>
                    <member.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">{member.emoji}</span>
                </div>

                {/* Name + Role */}
                <h3 className="relative z-10 text-[16px] font-heading font-bold group-hover:text-violet-700 transition-colors">{member.name}</h3>
                <p className="relative z-10 text-[11px] font-bold text-violet-600 mt-0.5">{member.role}</p>

                {/* Tag */}
                <span className="relative z-10 inline-block mt-2 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-semibold text-gray-500">
                  {member.tag}
                </span>

                {/* Task */}
                <p className="relative z-10 text-[12px] text-gray-400 mt-3 leading-relaxed line-clamp-3">
                  {member.task}
                </p>

                {/* GitHub */}
                <div className="relative z-10 mt-4 pt-3 border-t border-gray-100">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow strip */}
        <div className={`mt-10 transition-all duration-700 delay-600 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="bg-white rounded-2xl border border-gray-200/60 p-5 sm:p-6 shadow-card overflow-hidden">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider text-center mb-5">How We Built It</p>
            <div className="flex items-center gap-0 overflow-x-auto pb-2 scrollbar-hide justify-center">
              {[
                { emoji: "🎨", label: "Arooj designed", color: "bg-pink-100 text-pink-700" },
                { emoji: "→", label: "", color: "" },
                { emoji: "🚀", label: "Abdullah architected", color: "bg-violet-100 text-violet-700" },
                { emoji: "→", label: "", color: "" },
                { emoji: "⚡", label: "Hamid built backend", color: "bg-blue-100 text-blue-700" },
                { emoji: "→", label: "", color: "" },
                { emoji: "💻", label: "Amara coded frontend", color: "bg-emerald-100 text-emerald-700" },
                { emoji: "→", label: "", color: "" },
                { emoji: "🧠", label: "Mehwish trained AI", color: "bg-amber-100 text-amber-700" },
                { emoji: "→", label: "", color: "" },
                { emoji: "📢", label: "Zari documented", color: "bg-red-100 text-red-700" },
              ].map((item, i) => (
                item.label ? (
                  <div key={i} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${item.color} shrink-0 text-[11px] font-bold`}>
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </div>
                ) : (
                  <div key={i} className="px-1.5 text-gray-300 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";

const team = [
    {
        name: "Abdullah",
        role: "Founder & Lead Developer",
        bio: "Full-stack developer passionate about AI and automation. Architecting the future of university communication.",
        avatar: "A",
        gradient: "from-violet-500 to-indigo-600",
    },
    {
        name: "Arooj",
        role: "UI/UX Designer",
        bio: "Crafting beautiful, intuitive interfaces that make complex AI technology feel simple and accessible.",
        avatar: "A",
        gradient: "from-pink-500 to-rose-600",
    },
    {
        name: "Amara",
        role: "AI & ML Engineer",
        bio: "Building intelligent voice models that understand context, emotion, and multiple languages naturally.",
        avatar: "A",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        name: "Mehwish",
        role: "Backend Engineer",
        bio: "Designing scalable database architectures and APIs that handle thousands of concurrent calls.",
        avatar: "M",
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        name: "Zari",
        role: "Product Manager",
        bio: "Translating university needs into powerful features. Ensuring every interaction adds real value.",
        avatar: "Z",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        name: "Hamid",
        role: "DevOps & Infrastructure",
        bio: "Keeping everything running at 99.9% uptime. Managing deployments, scaling, and security.",
        avatar: "H",
        gradient: "from-red-500 to-rose-600",
    },
];

export default function Team() {
    return (
        <section id="team" className="py-28 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-violet-400 mb-4">
                        The Team
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight">
                        Built by <span className="gradient-text">students</span>,
                        <br className="hidden sm:block" />
                        for the future
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Six passionate students on a mission to revolutionize university
                        communication — without spending a penny. Just code, creativity, and caffeine.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative p-8 rounded-3xl glass card-shine hover:bg-white/[0.04] transition-all duration-500 glow-hover"
                        >
                            {/* Avatar */}
                            <div className="relative mb-6">
                                <div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-2xl font-heading font-bold text-white shadow-xl group-hover:scale-105 transition-transform duration-500`}
                                >
                                    {member.avatar}
                                </div>
                                <div
                                    className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-500`}
                                />
                            </div>

                            <h3 className="text-xl font-heading font-bold">{member.name}</h3>
                            <p className="text-sm text-violet-400 font-medium mt-1">
                                {member.role}
                            </p>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                {member.bio}
                            </p>

                            {/* Social links */}
                            <div className="flex items-center gap-2 mt-5">
                                {[Github, Linkedin, Twitter].map((Icon, j) => (
                                    <a
                                        key={j}
                                        href="#"
                                        className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-violet-400 transition-all duration-300"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
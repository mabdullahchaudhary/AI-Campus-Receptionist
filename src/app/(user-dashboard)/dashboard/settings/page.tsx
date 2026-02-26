"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield, Globe, Bell, Palette, Clock } from "lucide-react";
import { PageHeader, Badge } from "@/components/ui/Skeleton";
import { UNIVERSITY_NAME, UNIVERSITY_PHONE, APP_NAME } from "@/lib/config";

export default function SettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const sections = [
        {
            title: "Profile",
            icon: User,
            items: [
                { label: "Name", value: user?.name || "—" },
                { label: "Email", value: user?.email || "—" },
                { label: "Plan", value: (user?.plan || "free").toUpperCase() },
                { label: "Joined", value: "February 2026" },
            ],
        },
        {
            title: "AI Agent",
            icon: Globe,
            items: [
                { label: "Assistant", value: "Riley" },
                { label: "Model", value: "Groq — Llama 3.1 8B" },
                { label: "Voice", value: "Vapi — Elliot" },
                { label: "Languages", value: "English, Urdu, Urdlish" },
                { label: "Tools", value: "16 active" },
                { label: "University", value: UNIVERSITY_NAME },
                { label: "Contact", value: UNIVERSITY_PHONE },
            ],
        },
        {
            title: "Security",
            icon: Shield,
            items: [
                { label: "Auth Method", value: "Google OAuth" },
                { label: "6-Layer Verification", value: "Enabled" },
                { label: "Device Fingerprinting", value: "Active" },
                { label: "Rate Limiting", value: "Active" },
            ],
        },
        {
            title: "Preferences",
            icon: Palette,
            items: [
                { label: "Theme", value: "Light" },
                { label: "Timezone", value: "Asia/Karachi (PKT)" },
                { label: "Notifications", value: "Email" },
            ],
        },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            <PageHeader title="Settings" subtitle="Manage your account and preferences" />

            {sections.map((section) => (
                <div key={section.title} className="bg-white rounded-2xl border border-gray-200/60 shadow-card overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                        <section.icon className="w-4 h-4 text-violet-500" />
                        <h3 className="text-sm font-heading font-bold">{section.title}</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {section.items.map((item) => (
                            <div key={item.label} className="px-5 py-3 flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{item.label}</span>
                                <span className="text-sm font-medium">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
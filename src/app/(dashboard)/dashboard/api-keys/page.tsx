"use client";

import { useState } from "react";
import { Key, Shield, AlertCircle, Save, Eye, EyeOff } from "lucide-react";
import { PageHeader } from "@/components/ui/Skeleton";

export default function ApiKeysPage() {
    const [keys, setKeys] = useState({ vapi_public: "", vapi_private: "", groq_key: "" });
    const [showKeys, setShowKeys] = useState(false);

    return (
        <div className="space-y-6 max-w-3xl">
            <PageHeader title="API Keys (BYOK)" subtitle="Bring your own API keys for unlimited usage" />

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-violet-900">How BYOK Works</p>
                    <p className="text-xs text-violet-700/70 mt-1 leading-relaxed">When you add your own API keys, calls use YOUR credits instead of ours. This gives you unlimited calls without plan restrictions. Keys are encrypted and stored securely.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm flex items-center gap-2"><Key className="w-4 h-4 text-violet-500" />Your API Keys</h3>
                    <button onClick={() => setShowKeys(!showKeys)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                        {showKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showKeys ? "Hide" : "Show"}
                    </button>
                </div>

                {[
                    { key: "vapi_public", label: "Vapi Public Key", placeholder: "pk_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", link: "https://dashboard.vapi.ai" },
                    { key: "vapi_private", label: "Vapi Private Key", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", link: "https://dashboard.vapi.ai" },
                    { key: "groq_key", label: "Groq API Key (optional)", placeholder: "gsk_xxxxxxxxxxxx", link: "https://console.groq.com" },
                ].map((field) => (
                    <div key={field.key}>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-medium text-gray-700">{field.label}</label>
                            <a href={field.link} target="_blank" rel="noreferrer" className="text-[10px] text-violet-600 hover:underline">Get key →</a>
                        </div>
                        <input type={showKeys ? "text" : "password"} value={(keys as any)[field.key]} onChange={(e) => setKeys({ ...keys, [field.key]: e.target.value })} placeholder={field.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                    </div>
                ))}

                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition-colors">
                    <Save className="w-4 h-4" />Save Keys
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card">
                <h3 className="font-heading font-bold text-sm flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-emerald-500" />Security</h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                    <p>• Keys are encrypted with AES-256 before storage</p>
                    <p>• Keys are never exposed in client-side code</p>
                    <p>• You can delete your keys anytime</p>
                    <p>• We never share your keys with third parties</p>
                </div>
            </div>
        </div>
    );
}
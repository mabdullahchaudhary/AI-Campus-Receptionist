"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mic, ArrowLeft, Shield, Zap, Globe, Check, Phone, Brain, BookOpen, Users, BarChart3, Calendar } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        setIsLoading(true);
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* ...existing code... */}
        </div>
    );
}
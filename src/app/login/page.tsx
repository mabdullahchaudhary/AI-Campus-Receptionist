"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mic, ArrowLeft, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-background" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <Mic className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-heading font-bold">
                            Superior<span className="gradient-text"> AI</span>
                        </span>
                    </Link>

                    {/* Middle content */}
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl xl:text-5xl font-heading font-extrabold leading-tight"
                        >
                            Welcome to the
                            <br />
                            <span className="gradient-text">future of reception</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-4 text-lg text-muted-foreground max-w-md"
                        >
                            Sign in to manage your AI receptionist, view call analytics,
                            and configure everything from one powerful dashboard.
                        </motion.p>

                        {/* Features list */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-10 space-y-4"
                        >
                            {[
                                { icon: Shield, text: "Enterprise-grade security & data isolation" },
                                { icon: Zap, text: "Real-time analytics & call monitoring" },
                                { icon: Globe, text: "Multi-language AI in English & Urdu" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-violet-400" />
                                    </div>
                                    {item.text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom quote */}
                    <div className="text-sm text-muted-foreground/60">
                        &ldquo;Built by 6 students who believe AI should make education
                        accessible to everyone.&rdquo;
                    </div>
                </div>
            </div>

            {/* Right panel — login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                                <Mic className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-heading font-bold">
                                Superior<span className="gradient-text"> AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-heading font-extrabold">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Use your Google account to get started instantly. Free forever on the starter plan.
                        </p>

                        {/* Google sign in button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleGoogleLogin}
                            className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-base hover:bg-gray-100 transition-all duration-300 shadow-lg shadow-white/5"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </motion.button>

                        {/* Divider */}
                        <div className="mt-8 flex items-center gap-4">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">Secure & instant</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Info cards */}
                        <div className="mt-8 space-y-3">
                            {[
                                { label: "Free Plan", value: "3 calls/day • 60s limit • Basic analytics" },
                                { label: "Pro Plan", value: "Unlimited calls • Full dashboard • BYOK" },
                                { label: "Enterprise", value: "Multi-tenant • White-label • API access" },
                            ].map((plan) => (
                                <div
                                    key={plan.label}
                                    className="flex items-center justify-between p-4 rounded-xl glass text-sm"
                                >
                                    <span className="font-medium">{plan.label}</span>
                                    <span className="text-muted-foreground text-xs">{plan.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Terms */}
                        <p className="mt-8 text-xs text-muted-foreground text-center leading-relaxed">
                            By signing in, you agree to our{" "}
                            <a href="#" className="text-violet-400 hover:underline">Terms of Service</a>{" "}
                            and{" "}
                            <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
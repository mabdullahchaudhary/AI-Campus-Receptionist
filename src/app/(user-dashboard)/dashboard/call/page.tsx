"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    Loader2,
    Check,
    X,
    AlertTriangle,
    Phone,
    Mic,
    MicOff,
    PhoneOff,
    Volume2,
    MessageSquare,
    Crown,
    Clock,
    ArrowRight,
    Sparkles,
    Fingerprint,
    Wifi,
    User,
    Server,
    Eye,
} from "lucide-react";
import { generateFingerprint, type DeviceInfo } from "@/lib/fingerprint";
import { useVoiceCall } from "@/hooks/useVoiceCall";
import Link from "next/link";

interface VerificationLayer {
    name: string;
    status: string;
    detail: string;
}

const layerIcons: Record<string, React.ElementType> = {
    Authentication: User,
    "Account Standing": ShieldCheck,
    "Network Verification": Wifi,
    "Device Recognition": Fingerprint,
    "Abuse Detection": Eye,
    "Service Availability": Server,
    "Microphone Access": Mic,
};

function VerificationStep({
    layer,
    index,
    isAnimating,
}: {
    layer: VerificationLayer;
    index: number;
    isAnimating: boolean;
}) {
    const Icon = layerIcons[layer.name] || Shield;

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.6 }}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${layer.status === "passed"
                ? "bg-emerald-500/5 border border-emerald-500/20"
                : layer.status === "failed"
                    ? "bg-red-500/5 border border-red-500/20"
                    : layer.status === "warning"
                        ? "bg-amber-500/5 border border-amber-500/20"
                        : "bg-white/[0.02] border border-white/5"
                }`}
        >
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${layer.status === "passed"
                    ? "bg-emerald-500/10"
                    : layer.status === "failed"
                        ? "bg-red-500/10"
                        : layer.status === "warning"
                            ? "bg-amber-500/10"
                            : "bg-white/5"
                    }`}
            >
                {layer.status === "checking" ||
                    (isAnimating &&
                        layer.status !== "passed" &&
                        layer.status !== "failed" &&
                        layer.status !== "warning") ? (
                    <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                ) : (
                    <Icon
                        className={`w-5 h-5 ${layer.status === "passed"
                            ? "text-emerald-400"
                            : layer.status === "failed"
                                ? "text-red-400"
                                : layer.status === "warning"
                                    ? "text-amber-400"
                                    : "text-muted-foreground"
                            }`}
                    />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{layer.name}</span>
                    <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                        Layer {index + 1}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {layer.detail || "Checking..."}
                </p>
            </div>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: index * 0.6 + 0.3 }}
            >
                {layer.status === "passed" ? (
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                ) : layer.status === "failed" ? (
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-400" />
                    </div>
                ) : layer.status === "warning" ? (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

function AudioVisualizer({
    volume,
    isActive,
}: {
    volume: number;
    isActive: boolean;
}) {
    return (
        <div className="flex items-center justify-center gap-[2px] h-20">
            {Array.from({ length: 40 }).map((_, i) => {
                const distance = Math.abs(i - 20) / 20;
                const base = isActive ? 4 + (1 - distance) * 10 : 3;
                const h = isActive
                    ? base +
                    volume * 50 * (1 - distance * 0.6) * (0.4 + Math.random() * 0.6)
                    : base;
                return (
                    <motion.div
                        key={i}
                        className="w-[2px] rounded-full bg-gradient-to-t from-violet-600 via-violet-400 to-indigo-300"
                        animate={{ height: Math.max(3, Math.min(h, 72)) }}
                        transition={{ duration: 0.08, ease: "easeOut" }}
                    />
                );
            })}
        </div>
    );
}

export default function CallPage() {
    const { data: session } = useSession();
    const plan = (session?.user?.plan as string) || "free";

    const [phase, setPhase] = useState<
        "verify" | "ready" | "calling" | "ended" | "blocked"
    >("verify");
    const [layers, setLayers] = useState<VerificationLayer[]>([]);
    const [animatingIndex, setAnimatingIndex] = useState(0);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
    const [maxDuration, setMaxDuration] = useState(120);
    const [showTranscript, setShowTranscript] = useState(false);

    const {
        status,
        duration,
        formattedDuration,
        transcript,
        error,
        isMuted,
        volume,
        provider,
        startCall,
        endCall,
        toggleMute,
    } = useVoiceCall();

    // Run verification on mount
    useEffect(() => {
        runVerification();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runVerification = useCallback(async () => {
        setPhase("verify");
        setLayers([]);
        setAnimatingIndex(0);

        // Step 1: Generate fingerprint
        const fp = await generateFingerprint();
        setDeviceInfo(fp);

        // Step 2: Call verification API
        try {
            const res = await fetch("/api/calls/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fingerprint: fp.fingerprint,
                    deviceInfo: fp,
                }),
            });

            const data = await res.json();
            const serverLayers: VerificationLayer[] = data.layers || [];

            if (data.maxDurationSeconds) {
                setMaxDuration(data.maxDurationSeconds);
            }

            // Animate layers one by one
            for (let i = 0; i < serverLayers.length; i++) {
                setAnimatingIndex(i);

                // Show "checking" state first
                setLayers((prev) => [
                    ...prev,
                    { ...serverLayers[i], status: "checking", detail: "Verifying..." },
                ]);

                // Wait for animation
                await new Promise((r) => setTimeout(r, 800));

                // Show actual result
                setLayers((prev) =>
                    prev.map((l, idx) => (idx === i ? serverLayers[i] : l))
                );

                // Small delay between layers
                await new Promise((r) => setTimeout(r, 400));
            }

            // Final decision
            await new Promise((r) => setTimeout(r, 600));

            if (data.allowed) {
                setPhase("ready");
            } else {
                setPhase("blocked");
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setLayers([
                {
                    name: "System Error",
                    status: "failed",
                    detail: "Could not verify. Please try again.",
                },
            ]);
            setPhase("blocked");
        }
    }, []);

    const handleStartCall = async () => {
        // Check microphone permission first
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Got permission — stop the test stream immediately
            stream.getTracks().forEach((track) => track.stop());
        } catch (micError) {
            console.error("Microphone error:", micError);
            setPhase("blocked");
            setLayers((prev) => [
                ...prev,
                {
                    name: "Microphone Access",
                    status: "failed",
                    detail:
                        "Microphone permission denied. Please allow microphone access in your browser settings and try again.",
                },
            ]);
            return;
        }

        setPhase("calling");

        // Record usage
        try {
            await fetch("/api/calls/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "start",
                    fingerprint: deviceInfo?.fingerprint,
                }),
            });
        } catch (e) {
            console.warn("Failed to track call start:", e);
        }

        await startCall({
            assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "",
            userId: session?.user?.id,
            clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || "",
            plan,
            maxDurationSeconds: maxDuration,
        });
    };

    const handleEndCall = async () => {
        const callTranscript = transcript
            .map((t) => `${t.role}: ${t.text}`)
            .join("\n");

        await endCall();

        // Record call end
        try {
            await fetch("/api/calls/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "end",
                    duration,
                    transcript: callTranscript,
                    fingerprint: deviceInfo?.fingerprint,
                }),
            });
        } catch (e) {
            console.warn("Failed to track call end:", e);
        }

        // Record usage for all identity layers
        if (deviceInfo?.fingerprint) {
            try {
                await fetch("/api/calls/usage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fingerprint: deviceInfo.fingerprint,
                        seconds: duration,
                    }),
                });
            } catch (e) {
                console.warn("Failed to record usage:", e);
            }
        }

        setPhase("ended");
    };

    // Watch for call status changes
    useEffect(() => {
        if (status === "ended" && phase === "calling") {
            setPhase("ended");
        }
        if (status === "limit_reached") {
            setPhase("ended");
        }
    }, [status, phase]);

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
            >
                <h1 className="text-3xl font-heading font-extrabold">
                    {phase === "verify"
                        ? "Security Verification"
                        : phase === "ready"
                            ? "Ready to Call"
                            : phase === "calling"
                                ? "Call in Progress"
                                : phase === "ended"
                                    ? "Call Ended"
                                    : "Access Denied"}
                </h1>
                <p className="text-muted-foreground mt-2">
                    {phase === "verify"
                        ? "We're verifying your identity across multiple security layers..."
                        : phase === "ready"
                            ? `You have ${Math.floor(maxDuration / 60)}m ${maxDuration % 60}s of call time remaining today`
                            : phase === "calling"
                                ? "Your AI receptionist is listening"
                                : phase === "ended"
                                    ? "Thank you for using Superior AI"
                                    : "You've reached your daily limit"}
                </p>
            </motion.div>

            {/* ===== VERIFICATION PHASE ===== */}
            {phase === "verify" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                >
                    {/* Shield animation */}
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex justify-center mb-8"
                    >
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center">
                            <Shield className="w-10 h-10 text-violet-400" />
                        </div>
                    </motion.div>

                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden mb-6">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{
                                width: `${((animatingIndex + 1) / 6) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Layers */}
                    <div className="space-y-3">
                        {layers.map((layer, i) => (
                            <VerificationStep
                                key={i}
                                layer={layer}
                                index={i}
                                isAnimating={i === animatingIndex}
                            />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ===== READY PHASE ===== */}
            {phase === "ready" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="text-center"
                >
                    {/* Success shield */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                                <ShieldCheck className="w-12 h-12 text-emerald-400" />
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                            >
                                <Check className="w-5 h-5 text-white" />
                            </motion.div>
                        </div>
                    </motion.div>

                    <h2 className="text-xl font-heading font-bold text-emerald-400 mb-2">
                        All Checks Passed!
                    </h2>
                    <p className="text-muted-foreground mb-2">
                        Your identity has been verified across 6 security layers.
                    </p>

                    {/* Time info */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-8">
                        <Clock className="w-4 h-4 text-violet-400" />
                        <span className="text-sm text-violet-300">
                            {plan === "free"
                                ? `Free Plan: ${Math.floor(maxDuration / 60)}m ${maxDuration % 60}s remaining today`
                                : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan: ${Math.floor(maxDuration / 60)} minutes remaining`}
                        </span>
                    </div>

                    {/* University phone number */}
                    <div className="p-5 rounded-2xl glass mb-6">
                        <p className="text-xs text-muted-foreground mb-2">
                            Or call directly:
                        </p>
                        <a
                            href="tel:+924235761999"
                            className="text-xl font-heading font-bold text-foreground hover:text-violet-400 transition-colors"
                        >
                            042-3576-1999
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">
                            Superior University Main Reception
                        </p>
                    </div>

                    {/* Call button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleStartCall}
                        className="flex items-center gap-3 px-10 py-5 mx-auto rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-bold glow hover:from-violet-500 hover:to-indigo-500 transition-all group"
                    >
                        <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Start AI Call
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>
            )}

            {/* ===== CALLING PHASE ===== */}
            {phase === "calling" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Timer + status */}
                    <div className="text-center">
                        <div className="text-5xl font-heading font-extrabold tabular-nums gradient-text">
                            {formattedDuration}
                        </div>
                        {plan === "free" && (
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-xs text-amber-300">
                                    {Math.max(0, maxDuration - duration)}s remaining
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Error display */}
                    {status === "error" && error && (
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-center">
                            <p className="text-sm text-red-400">{error}</p>
                            <button
                                onClick={handleStartCall}
                                className="mt-3 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Visualizer */}
                    {status !== "error" && (
                        <div className="p-6 rounded-3xl glass">
                            <AudioVisualizer
                                volume={volume}
                                isActive={status === "active"}
                            />

                            <div className="flex items-center justify-center gap-2 mt-4">
                                <span
                                    className={`w-2 h-2 rounded-full ${status === "active"
                                        ? "bg-emerald-400 animate-pulse"
                                        : "bg-amber-400 animate-pulse"
                                        }`}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {status === "active"
                                        ? "Connected"
                                        : status === "connecting"
                                            ? "Connecting..."
                                            : status === "ringing"
                                                ? "Ringing..."
                                                : "Waiting..."}
                                    {provider && ` via ${provider}`}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Transcript toggle */}
                    <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {showTranscript ? "Hide" : "Show"} Live Transcript
                        {transcript.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-[10px] font-bold">
                                {transcript.length}
                            </span>
                        )}
                    </button>

                    {/* Transcript panel */}
                    <AnimatePresence>
                        {showTranscript && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-2xl glass p-4 max-h-60 overflow-y-auto space-y-2"
                            >
                                {transcript.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground/50 py-4">
                                        Conversation will appear here...
                                    </p>
                                ) : (
                                    transcript.map((entry, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${entry.role === "user"
                                                    ? "bg-violet-500/15 text-violet-100 rounded-br-sm"
                                                    : entry.role === "system"
                                                        ? "bg-white/5 text-muted-foreground/60 italic text-xs text-center"
                                                        : "bg-white/[0.06] rounded-bl-sm"
                                                    }`}
                                            >
                                                {entry.text}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Call controls */}
                    {status !== "error" && (
                        <div className="flex items-center justify-center gap-5">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleMute}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isMuted
                                    ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                    : "bg-white/5 text-foreground hover:bg-white/10"
                                    }`}
                            >
                                {isMuted ? (
                                    <MicOff className="w-7 h-7" />
                                ) : (
                                    <Mic className="w-7 h-7" />
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEndCall}
                                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-red-500/25"
                            >
                                <PhoneOff className="w-8 h-8" />
                            </motion.button>

                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                <Volume2 className="w-7 h-7 text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ===== ENDED PHASE ===== */}
            {phase === "ended" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-violet-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-heading font-bold">Call Complete</h2>
                        <p className="text-muted-foreground mt-1">
                            Duration: {formattedDuration} • {transcript.length} messages
                        </p>
                    </div>

                    {/* Transcript summary */}
                    {transcript.length > 0 && (
                        <div className="p-5 rounded-2xl glass text-left max-h-48 overflow-y-auto space-y-2">
                            {transcript
                                .filter((t) => t.role !== "system")
                                .map((entry, i) => (
                                    <div key={i} className="text-sm">
                                        <span
                                            className={`font-semibold ${entry.role === "user"
                                                ? "text-violet-400"
                                                : "text-emerald-400"
                                                }`}
                                        >
                                            {entry.role === "user" ? "You" : "AI"}:
                                        </span>{" "}
                                        <span className="text-muted-foreground">{entry.text}</span>
                                    </div>
                                ))}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {plan === "free" && (
                            <Link href="/dashboard/billing">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold"
                                >
                                    <Crown className="w-5 h-5" />
                                    Upgrade for Longer Calls
                                </motion.button>
                            </Link>
                        )}
                        <button
                            onClick={() => runVerification()}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-white/[0.06] transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Call Again
                        </button>
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-white/[0.06] transition-colors"
                            >
                                Back to Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            )}

            {/* ===== BLOCKED PHASE ===== */}
            {phase === "blocked" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                >
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>

                    <div>
                        <h2 className="text-xl font-heading font-bold text-red-400">
                            Access Restricted
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            You&apos;ve reached your daily call limit or our security system
                            detected an issue. Upgrade your plan for more calls.
                        </p>
                    </div>

                    {/* Show failed layers */}
                    <div className="space-y-2 max-w-md mx-auto">
                        {layers
                            .filter((l) => l.status === "failed")
                            .map((layer, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                                >
                                    <X className="w-4 h-4 text-red-400 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium">{layer.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {layer.detail}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link href="/dashboard/billing">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold"
                            >
                                <Sparkles className="w-5 h-5" />
                                Upgrade Plan
                            </motion.button>
                        </Link>
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                className="px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-white/[0.06] transition-colors"
                            >
                                Back to Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
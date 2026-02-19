import { VAPI_PUBLIC_KEY, VAPI_ASSISTANT_ID } from "@/lib/config";
export type ProviderType = "vapi" | "browser";

export type CallStatus =
    | "idle"
    | "connecting"
    | "ringing"
    | "active"
    | "ending"
    | "ended"
    | "error"
    | "limit_reached";

export interface CallConfig {
    assistantId: string;
    userId?: string;
    clientId?: string;
    plan?: string;
    maxDurationSeconds?: number;
    metadata?: Record<string, unknown>;
}

export interface CallState {
    status: CallStatus;
    provider: ProviderType | null;
    callId: string | null;
    startedAt: number | null;
    duration: number;
    transcript: TranscriptEntry[];
    error: string | null;
    isMuted: boolean;
    volume: number;
}

export interface TranscriptEntry {
    role: "user" | "assistant" | "system";
    text: string;
    timestamp: number;
}

type CallStateListener = (state: CallState) => void;
type VolumeListener = (volume: number) => void;
type TranscriptListener = (entry: TranscriptEntry) => void;

class VoiceProviderManager {
    private state: CallState = {
        status: "idle",
        provider: null,
        callId: null,
        startedAt: null,
        duration: 0,
        transcript: [],
        error: null,
        isMuted: false,
        volume: 0,
    };

    private stateListeners: Set<CallStateListener> = new Set();
    private transcriptListeners: Set<TranscriptListener> = new Set();
    private volumeListeners: Set<VolumeListener> = new Set();
    private durationTimer: ReturnType<typeof setInterval> | null = null;
    private maxDurationTimer: ReturnType<typeof setTimeout> | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private vapiInstance: any = null;
    private vapiReady: boolean = false;

    // ==================== STATE ====================

    private setState(updates: Partial<CallState>) {
        this.state = { ...this.state, ...updates };
        this.stateListeners.forEach((l) => l({ ...this.state }));
    }

    getState(): CallState {
        return { ...this.state };
    }

    onStateChange(listener: CallStateListener): () => void {
        this.stateListeners.add(listener);
        return () => {
            this.stateListeners.delete(listener);
        };
    }

    onTranscript(listener: TranscriptListener): () => void {
        this.transcriptListeners.add(listener);
        return () => {
            this.transcriptListeners.delete(listener);
        };
    }

    onVolumeChange(listener: VolumeListener): () => void {
        this.volumeListeners.add(listener);
        return () => {
            this.volumeListeners.delete(listener);
        };
    }

    // ==================== CALL LIFECYCLE ====================

    async startCall(config: CallConfig): Promise<void> {
        // Allow starting only from these states
        const allowedStates: CallStatus[] = [
            "idle",
            "ended",
            "error",
            "limit_reached",
        ];
        if (!allowedStates.includes(this.state.status)) {
            console.warn("Cannot start call from state:", this.state.status);
            return;
        }

        // Reset state
        this.setState({
            status: "connecting",
            error: null,
            transcript: [],
            callId: null,
            startedAt: null,
            duration: 0,
            isMuted: false,
            volume: 0,
            provider: null,
        });

        // Try Vapi first, then browser fallback
        try {
            await this.connectVapi(config);
            this.setState({ provider: "vapi" });
            this.startDurationTracking(config.maxDurationSeconds || 120);
        } catch (vapiError) {
            console.warn("Vapi connection failed, trying browser fallback:", vapiError);

            try {
                await this.connectBrowserFallback();
                this.setState({ provider: "browser" });
                this.startDurationTracking(config.maxDurationSeconds || 120);
            } catch (browserError) {
                console.error("All providers failed:", browserError);
                this.setState({
                    status: "error",
                    error:
                        "Could not connect to voice service. Please check your microphone permissions and try again.",
                });
            }
        }
    }

    async endCall(): Promise<void> {
        if (this.state.status === "idle" || this.state.status === "ended") {
            return;
        }

        this.setState({ status: "ending" });
        this.stopDurationTracking();

        try {
            if (this.vapiInstance && this.vapiReady) {
                this.vapiInstance.stop();
            }
        } catch (error) {
            console.warn("Error stopping vapi:", error);
        }

        // Clean up vapi instance
        this.cleanupVapi();

        this.setState({
            status: "ended",
            provider: null,
        });
    }

    toggleMute(): void {
        if (this.state.status !== "active") return;

        const newMuted = !this.state.isMuted;
        this.setState({ isMuted: newMuted });

        try {
            if (this.vapiInstance && this.vapiReady) {
                this.vapiInstance.setMuted(newMuted);
            }
        } catch (error) {
            console.warn("Error toggling mute:", error);
        }
    }

    // ==================== VAPI ====================

    private cleanupVapi() {
        if (this.vapiInstance) {
            try {
                // Remove all listeners to prevent memory leaks
                this.vapiInstance.removeAllListeners?.();
            } catch (_e) {
                // ignore
            }
            this.vapiInstance = null;
        }
        this.vapiReady = false;
    }

    private async connectVapi(config: CallConfig): Promise<void> {
        const publicKey = VAPI_PUBLIC_KEY;
        if (!publicKey) {
            throw new Error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set in .env.local");
        }

        const assistantId = config.assistantId || VAPI_ASSISTANT_ID;
        if (!assistantId) {
            throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is not set in .env.local");
        }

        // Clean up any previous instance
        this.cleanupVapi();

        // Dynamic import
        const VapiModule = await import("@vapi-ai/web");
        const Vapi = VapiModule.default;

        // Create new instance
        this.vapiInstance = new Vapi(publicKey);

        // Set up a promise that resolves on call-start or rejects on error
        return new Promise<void>((resolve, reject) => {
            let resolved = false;
            let callStartTimeout: ReturnType<typeof setTimeout>;

            // Timeout — if call doesn't start in 15 seconds, fail
            callStartTimeout = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    this.cleanupVapi();
                    reject(new Error("Call connection timed out after 15 seconds"));
                }
            }, 15000);

            // Call started successfully
            this.vapiInstance.on("call-start", () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(callStartTimeout);
                    this.vapiReady = true;
                    this.setState({
                        status: "active",
                        startedAt: Date.now(),
                        callId: `vapi_${Date.now()}`,
                    });
                    this.addTranscript("system", "Call connected successfully");
                    resolve();
                }
            });

            // Call ended
            this.vapiInstance.on("call-end", () => {
                this.addTranscript("system", "Call ended");
                this.stopDurationTracking();
                this.cleanupVapi();

                // Only update state if we're not already in an end state
                if (
                    this.state.status !== "ended" &&
                    this.state.status !== "error" &&
                    this.state.status !== "limit_reached"
                ) {
                    this.setState({ status: "ended", provider: null });
                }

                if (!resolved) {
                    resolved = true;
                    clearTimeout(callStartTimeout);
                    reject(new Error("Call ended before it started"));
                }
            });

            // Messages (transcripts, function calls)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.vapiInstance.on("message", (message: any) => {
                try {
                    if (
                        message.type === "transcript" &&
                        message.transcriptType === "final" &&
                        message.transcript
                    ) {
                        this.addTranscript(
                            message.role === "user" ? "user" : "assistant",
                            message.transcript
                        );
                    }

                    if (message.type === "function-call" && message.functionCall) {
                        this.addTranscript(
                            "system",
                            `Tool: ${message.functionCall.name || "unknown"}`
                        );
                    }
                } catch (e) {
                    console.warn("Error processing message:", e);
                }
            });

            // Volume
            this.vapiInstance.on("volume-level", (vol: number) => {
                this.setState({ volume: vol });
                this.volumeListeners.forEach((l) => l(vol));
            });

            // Error
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.vapiInstance.on("error", (err: any) => {
                const errorMessage =
                    err?.message ||
                    err?.error?.message ||
                    (typeof err === "string" ? err : "Voice connection failed. Please check your microphone.");

                console.error("Vapi error details:", JSON.stringify(err, null, 2));

                this.stopDurationTracking();
                this.cleanupVapi();

                this.setState({
                    status: "error",
                    error: errorMessage,
                    provider: null,
                });

                if (!resolved) {
                    resolved = true;
                    clearTimeout(callStartTimeout);
                    reject(new Error(errorMessage));
                }
            });

            // Now actually start the call
            this.setState({ status: "ringing" });

            try {
                this.vapiInstance.start(assistantId, {
                    metadata: {
                        client_id:
                            config.clientId || "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                        user_id: config.userId || "anonymous",
                        plan: config.plan || "free",
                        ...(config.metadata || {}),
                    },
                });
            } catch (startErr) {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(callStartTimeout);
                    this.cleanupVapi();
                    reject(startErr);
                }
            }
        });
    }

    // ==================== BROWSER FALLBACK ====================

    private async connectBrowserFallback(): Promise<void> {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            throw new Error("Browser speech not available");
        }

        this.setState({
            status: "active",
            startedAt: Date.now(),
            callId: `browser_${Date.now()}`,
        });

        this.addTranscript("system", "Connected via browser (limited mode)");
        this.addTranscript(
            "assistant",
            "Assalam-o-Alaikum! Thank you for calling Superior University. I'm running in basic mode. For the full experience, please try again later or call us at 042-35761999."
        );

        try {
            const utterance = new SpeechSynthesisUtterance(
                "Assalam-o-Alaikum! Thank you for calling Superior University. How can I help you?"
            );
            utterance.rate = 1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("TTS error:", e);
        }
    }

    // ==================== UTILITIES ====================

    private addTranscript(role: TranscriptEntry["role"], text: string) {
        const entry: TranscriptEntry = { role, text, timestamp: Date.now() };
        this.setState({ transcript: [...this.state.transcript, entry] });
        this.transcriptListeners.forEach((l) => l(entry));
    }

    private startDurationTracking(maxSeconds: number) {
        this.stopDurationTracking(); // Clear any existing timers

        this.durationTimer = setInterval(() => {
            if (this.state.startedAt && this.state.status === "active") {
                const elapsed = Math.floor(
                    (Date.now() - this.state.startedAt) / 1000
                );
                this.setState({ duration: elapsed });
            }
        }, 1000);

        this.maxDurationTimer = setTimeout(() => {
            if (this.state.status === "active") {
                this.addTranscript("system", "Maximum call duration reached");
                this.endCall().then(() => {
                    this.setState({ status: "limit_reached" });
                });
            }
        }, maxSeconds * 1000);
    }

    private stopDurationTracking() {
        if (this.durationTimer) {
            clearInterval(this.durationTimer);
            this.durationTimer = null;
        }
        if (this.maxDurationTimer) {
            clearTimeout(this.maxDurationTimer);
            this.maxDurationTimer = null;
        }
    }

    // ==================== CLEANUP ====================

    destroy() {
        this.stopDurationTracking();
        this.cleanupVapi();
        this.stateListeners.clear();
        this.transcriptListeners.clear();
        this.volumeListeners.clear();
    }
}

// Singleton
let instance: VoiceProviderManager | null = null;

export function getVoiceManager(): VoiceProviderManager {
    if (!instance) {
        instance = new VoiceProviderManager();
    }
    return instance;
}

export function resetVoiceManager(): void {
    if (instance) {
        instance.destroy();
        instance = null;
    }
}
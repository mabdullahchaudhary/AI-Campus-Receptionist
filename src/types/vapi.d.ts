declare module "@vapi-ai/web" {
    interface VapiEventHandlers {
        "call-start": () => void;
        "call-end": () => void;
        "speech-start": () => void;
        "speech-end": () => void;
        "volume-level": (volume: number) => void;
        "message": (message: Record<string, unknown>) => void;
        "error": (error: { message: string }) => void;
    }

    export default class Vapi {
        constructor(publicKey: string);
        start(assistantId: string, options?: Record<string, unknown>): Promise<void>;
        stop(): void;
        setMuted(muted: boolean): void;
        on<K extends keyof VapiEventHandlers>(event: K, handler: VapiEventHandlers[K]): void;
    }
}
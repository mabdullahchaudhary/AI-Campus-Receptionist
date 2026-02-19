"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    getVoiceManager,
    type CallState,
    type CallConfig,
} from "@/lib/voice/provider-manager";

export function useVoiceCall() {
    const [callState, setCallState] = useState<CallState>({
        status: "idle",
        provider: null,
        callId: null,
        startedAt: null,
        duration: 0,
        transcript: [],
        error: null,
        isMuted: false,
        volume: 0,
    });

    const managerRef = useRef(getVoiceManager());

    useEffect(() => {
        const manager = managerRef.current;
        const unsubState = manager.onStateChange(setCallState);

        return () => {
            unsubState();
        };
    }, []);

    const startCall = useCallback(async (config: CallConfig) => {
        await managerRef.current.startCall(config);
    }, []);

    const endCall = useCallback(async () => {
        await managerRef.current.endCall();
    }, []);

    const toggleMute = useCallback(() => {
        managerRef.current.toggleMute();
    }, []);

    const formattedDuration = formatDuration(callState.duration);

    return {
        ...callState,
        formattedDuration,
        startCall,
        endCall,
        toggleMute,
    };
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
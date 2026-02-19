
export interface DeviceInfo {
    fingerprint: string;
    screenResolution: string;
    timezone: string;
    language: string;
    platform: string;
    userAgent: string;
    colorDepth: number;
    hardwareConcurrency: number;
    touchSupport: boolean;
    webglRenderer: string;
    canvasHash: string;
}

function getCanvasFingerprint(): string {
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return "no-canvas";

        canvas.width = 200;
        canvas.height = 50;

        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("SuperiorAI🎓", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("SuperiorAI🎓", 4, 17);

        return canvas.toDataURL().slice(-50);
    } catch {
        return "canvas-error";
    }
}

function getWebGLRenderer(): string {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return "no-webgl";

        const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (!debugInfo) return "no-debug-info";

        return (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "unknown";
    } catch {
        return "webgl-error";
    }
}

async function hashString(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateFingerprint(): Promise<DeviceInfo> {
    const screenResolution = `${screen.width}x${screen.height}x${screen.colorDepth}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    const colorDepth = screen.colorDepth;
    const hardwareConcurrency = navigator.hardwareConcurrency || 0;
    const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const webglRenderer = getWebGLRenderer();
    const canvasHash = getCanvasFingerprint();

    // Combine all signals into a unique string
    const raw = [
        screenResolution,
        timezone,
        language,
        platform,
        colorDepth,
        hardwareConcurrency,
        touchSupport,
        webglRenderer,
        canvasHash,
        // Don't include userAgent in hash (changes with updates)
        // but include hardware-level signals
    ].join("|");

    const fingerprint = await hashString(raw);

    return {
        fingerprint,
        screenResolution,
        timezone,
        language,
        platform,
        userAgent,
        colorDepth,
        hardwareConcurrency,
        touchSupport,
        webglRenderer,
        canvasHash,
    };
}
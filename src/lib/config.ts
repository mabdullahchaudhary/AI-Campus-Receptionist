/**
 * Central configuration — single source of truth for all external service
 * integrations. All values are sourced from environment variables with no
 * hardcoded fallbacks, forcing explicit configuration in every environment.
 */

// ==================== SUPABASE ====================
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ==================== VAPI ====================
export const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!;
export const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
export const VAPI_API_URL = "https://api.vapi.ai";

// ==================== VAPI ASSISTANT CONFIG ====================
export const VAPI_MODEL_CONFIG = {
    provider: "groq" as const,
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
};

export const VAPI_VOICE_CONFIG = {
    provider: "vapi" as const,
    voiceId: "Elliot",
};

export const VAPI_TRANSCRIBER_CONFIG = {
    provider: "deepgram" as const,
    model: "nova-2",
    language: "en",
};

// ==================== N8N ====================
export const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

// ==================== APP ====================
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;
export const APP_NAME = "Superior AI";
export const UNIVERSITY_NAME = "Superior University";
export const UNIVERSITY_PHONE = "042-35761999";
export const UNIVERSITY_ADDRESS = "17-KM Raiwind Road, Lahore, Pakistan";
export const UNIVERSITY_WEBSITE = "www.superior.edu.pk";

/**
 * Server-only: default tenant client ID for the university demo.
 * Never use NEXT_PUBLIC_ prefix — must not be exposed to the browser.
 */
export const DEFAULT_CLIENT_ID = process.env.DEFAULT_CLIENT_ID!;

// ==================== PLAN LIMITS ====================
export const PLAN_LIMITS = {
    free: {
        maxSeconds: 120,
        maxCallAttempts: 10,
        maxCallDuration: 120,
        features: ["2-min calls", "Basic transcript", "Knowledge base (view only)"],
    },
    pro: {
        maxSeconds: 3600,
        maxCallAttempts: 1000,
        maxCallDuration: 1800,
        features: ["Unlimited calls", "Full transcripts", "Knowledge base CRUD", "Contact CRM", "Appointments", "Analytics", "BYOK", "Priority support"],
    },
    enterprise: {
        maxSeconds: 7200,
        maxCallAttempts: 99999,
        maxCallDuration: 3600,
        features: ["Everything in Pro", "Phone number", "Custom voice", "API access", "White label", "Dedicated support"],
    },
} as const;

// ==================== VOICE PROVIDERS ====================
export const VOICE_PROVIDERS = ["vapi", "retell", "bland"] as const;

// ==================== KNOWLEDGE CATEGORIES ====================
export const KNOWLEDGE_CATEGORIES = [
    "admissions", "fees", "scholarships", "departments",
    "campus", "contact", "hostel", "transport", "general",
] as const;
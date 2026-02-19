/**
 * ═══════════════════════════════════════════════════════════════
 * CENTRAL CONFIGURATION — ALL API KEYS, URLs, AND SETTINGS
 * ═══════════════════════════════════════════════════════════════
 *
 * IMPORTANT: This is the ONLY file where API keys and URLs
 * should be defined. All other files import from here.
 *
 * To change ANY key or URL → change it HERE → done everywhere.
 */

// ==================== SUPABASE ====================
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ybwkohutsunvqdybptxq.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// ==================== VAPI ====================
export const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
export const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "34cd5986-2239-40b9-9762-d11d89dab004";
export const VAPI_API_URL = "https://api.vapi.ai";

// ==================== N8N ====================
export const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "https://superiorproject.app.n8n.cloud/webhook/ai-receptionist";

// ==================== APP ====================
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://superior-ai.vercel.app";
export const APP_NAME = "Superior AI";
export const UNIVERSITY_NAME = "Superior University";
export const UNIVERSITY_PHONE = "042-35761999";
export const UNIVERSITY_ADDRESS = "17-KM Raiwind Road, Lahore, Pakistan";
export const UNIVERSITY_WEBSITE = "www.superior.edu.pk";

// ==================== CLIENT ====================
export const DEFAULT_CLIENT_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

// ==================== PLAN LIMITS ====================
export const PLAN_LIMITS = {
    free: {
        maxSeconds: 120,        // 2 minutes total per day
        maxCallAttempts: 10,
        maxCallDuration: 120,   // 2 min per call
        features: ["2-min calls", "Basic transcript", "Knowledge base (view only)"],
    },
    pro: {
        maxSeconds: 3600,       // 60 minutes total per day
        maxCallAttempts: 1000,
        maxCallDuration: 1800,  // 30 min per call
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
export interface Client {
    id: string;
    client_name: string;
    slug: string;
    plan: "free" | "active" | "enterprise";
    website_url: string;
    receptionist_number: string;
    system_prompt: string;
    greeting_message: string;
    business_hours: {
        start: string;
        end: string;
        timezone: string;
    };
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    client_id: string;
    full_name: string;
    phone: string;
    email: string;
    source: string;
    first_seen_at: string;
    last_seen_at: string;
}

export interface CallLog {
    id: string;
    client_id: string;
    session_id: string;
    caller_ip: string;
    status: "started" | "completed" | "failed" | "spam_blocked";
    duration_seconds: number;
    transcript: string;
    ai_summary: string;
    sentiment: "positive" | "neutral" | "negative";
    created_at: string;
    ended_at: string;
}

export interface Appointment {
    id: string;
    client_id: string;
    visitor_name: string;
    visitor_phone: string;
    visitor_email: string;
    department: string;
    purpose: string;
    scheduled_at: string;
    duration_minutes: number;
    status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
    reminder_sent: boolean;
    created_at: string;
}

export interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    buttonText: string;
    tier: "free" | "pro" | "enterprise";
}
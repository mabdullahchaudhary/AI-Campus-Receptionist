import { N8N_WEBHOOK_URL } from "@/lib/config";

export interface ToolDefinition {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: "object";
            properties: Record<string, { type: string; description: string }>;
            required: string[];
        };
    };
    messages: { type: string; blocking: boolean }[];
    server: {
        url: string;
        timeoutSeconds: number;
    };
}

export function getAllTools(): ToolDefinition[] {
    const serverConfig = {
        url: N8N_WEBHOOK_URL,
        timeoutSeconds: 20,
    };

    return [
        {
            type: "function",
            function: {
                name: "check_knowledge",
                description:
                    "Search the university knowledge base to find information about fees, admissions, scholarships, departments, campus facilities, contact information, or any other topic. ALWAYS use this tool when the caller asks ANY question about the university.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "The caller's question or topic to search for" },
                        category: {
                            type: "string",
                            description:
                                "Optional category: admissions, fees, scholarships, departments, campus, contact, hostel, transport, general",
                        },
                    },
                    required: ["query"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_fee",
                description:
                    "Get the exact fee structure for a specific academic program. Use when caller asks about tuition, costs, or payment plans.",
                parameters: {
                    type: "object",
                    properties: {
                        program: {
                            type: "string",
                            description: "The program name, e.g. BS Computer Science, MBA, Pharm-D",
                        },
                    },
                    required: ["program"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_scholarship",
                description:
                    "Check scholarship eligibility and available types. Use when caller asks about financial aid, discounts, or merit scholarships.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "The scholarship-related question" },
                        marks_percentage: {
                            type: "string",
                            description: "The caller's marks percentage if mentioned",
                        },
                    },
                    required: ["query"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_hostel",
                description:
                    "Get hostel availability, room types, pricing, and facilities. Use when caller asks about accommodation.",
                parameters: { type: "object", properties: {}, required: [] },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_transport",
                description:
                    "Get university bus routes, timings, and transport fees. Use when caller asks about transportation.",
                parameters: {
                    type: "object",
                    properties: {
                        area: { type: "string", description: "The area the caller lives in" },
                    },
                    required: [],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_campus",
                description: "Get campus facilities, labs, library, sports, and amenities information.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Specific facility question" },
                    },
                    required: [],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_faq",
                description: "Answer FAQs about HEC recognition, transfers, refund policy, dress code, etc.",
                parameters: {
                    type: "object",
                    properties: {
                        question: { type: "string", description: "The FAQ question" },
                    },
                    required: ["question"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_departments",
                description: "Get a list of all departments, faculties, and academic programs offered.",
                parameters: { type: "object", properties: {}, required: [] },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "check_admission_status",
                description: "Get admission dates, deadlines, process, documents, and entry test info.",
                parameters: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Specific admission question" },
                    },
                    required: [],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "save_contact",
                description:
                    "Save caller's contact info. ONLY use when caller provides their REAL name. Never save unknown or empty.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Caller's full name (must be real)" },
                        phone: { type: "string", description: "Phone number" },
                        email: { type: "string", description: "Email address" },
                    },
                    required: ["name"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "book_visit",
                description:
                    "Schedule a campus visit appointment. Use when caller wants to visit university.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Visitor name" },
                        phone: { type: "string", description: "Phone number" },
                        department: { type: "string", description: "Department to visit" },
                        datetime: { type: "string", description: "Preferred date/time" },
                    },
                    required: ["name"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "detect_returning",
                description: "Check if caller has called before to personalize greeting.",
                parameters: {
                    type: "object",
                    properties: {
                        phone: { type: "string", description: "Caller's phone number" },
                    },
                    required: ["phone"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "score_lead",
                description: "Rate how interested a caller is to prioritize follow-up.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Caller name" },
                        phone: { type: "string", description: "Phone" },
                        program: { type: "string", description: "Interested program" },
                        interest_level: { type: "string", description: "high, medium, or low" },
                    },
                    required: ["name", "interest_level"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "schedule_callback",
                description:
                    "Schedule callback from university staff when caller requests follow-up.",
                parameters: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Caller name" },
                        phone: { type: "string", description: "Phone to call back" },
                        reason: { type: "string", description: "Callback reason" },
                        preferred_time: { type: "string", description: "When to call" },
                    },
                    required: ["name", "phone"],
                },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "transfer_human",
                description:
                    "Transfer to human receptionist. Use when frustrated or asks for human.",
                parameters: { type: "object", properties: {}, required: [] },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
        {
            type: "function",
            function: {
                name: "end_conversation",
                description:
                    "Gracefully end the conversation. Use when caller says goodbye or has no more questions.",
                parameters: { type: "object", properties: {}, required: [] },
            },
            messages: [{ type: "request-start", blocking: false }],
            server: serverConfig,
        },
    ];
}

export function getToolByName(name: string) {
    return getAllTools().find((tool) => tool.function.name === name) || null;
}


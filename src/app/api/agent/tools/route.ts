import { NextRequest, NextResponse } from "next/server";
import { executeTool } from "@/features/agent/tools-executor";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const functionName = body.function_name || body.message?.functionCall?.name || "";
        const params = body.function_params || body.message?.functionCall?.parameters || {};
        const toolCallId = body.tool_call_id || body.message?.functionCall?.id || "call_1";

        const result = await executeTool(functionName, params);

        return NextResponse.json({
            results: [{
                toolCallId: toolCallId,
                result: result,
            }],
        });
    } catch (error: any) {
        console.error("Agent tools error:", error);
        return NextResponse.json({
            results: [{
                toolCallId: "call_1",
                result: "System error occurred. Apologize and ask the caller to try again or call 042-35761999 directly.",
            }],
        });
    }
}
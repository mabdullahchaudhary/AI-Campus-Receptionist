import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, handleCheckoutCompleted } from "@/features/billing/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
    }
    let rawBody: string;
    try {
        rawBody = await req.text();
    } catch {
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    let event;
    try {
        event = await constructWebhookEvent(rawBody, signature);
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Webhook signature verification failed";
        return NextResponse.json({ error: message }, { status: 400 });
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        if (session.mode === "payment") {
            await handleCheckoutCompleted(session);
        }
    }
    return NextResponse.json({ received: true });
}

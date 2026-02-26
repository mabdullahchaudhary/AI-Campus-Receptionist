import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, handleCheckoutCompleted } from "@/features/billing/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    console.log("[Webhook] Webhook received");
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        console.log("[Webhook] Missing stripe-signature header");
        return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
    }
    let rawBody: string;
    try {
        rawBody = await req.text();
    } catch (e) {
        console.error("[Webhook] Failed to read body", e);
        return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
    let event;
    try {
        event = await constructWebhookEvent(rawBody, signature);
        console.log("[Webhook] Signature verified");
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Webhook signature verification failed";
        console.error("[Webhook] Signature verification failed", e);
        return NextResponse.json({ error: message }, { status: 400 });
    }
    console.log("[Webhook] Event type: " + event.type);
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as import("stripe").Stripe.Checkout.Session;
        const email = session.customer_email ?? session.customer_details?.email ?? null;
        console.log("[Webhook] User Email: " + (email ?? "null"));
        console.log("[Webhook] metadata.userId: " + (session.metadata?.userId ?? "null"));
        if (session.mode === "payment") {
            try {
                await handleCheckoutCompleted(session);
                console.log("[Webhook] handleCheckoutCompleted finished");
            } catch (e) {
                console.error("[Webhook] handleCheckoutCompleted error", e);
                return NextResponse.json({ error: "Processing failed" }, { status: 500 });
            }
        }
    }
    return NextResponse.json({ received: true });
}

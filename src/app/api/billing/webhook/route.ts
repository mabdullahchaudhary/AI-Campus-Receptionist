import { NextRequest, NextResponse } from "next/server";
import { errorRedirect } from "@/lib/error-redirect";
import { constructWebhookEvent, handleCheckoutCompleted } from "@/features/billing/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    console.log("[Webhook] Webhook received");
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        console.log("[Webhook] Missing stripe-signature header");
        return errorRedirect(req, 400, "Missing stripe-signature");
    }
    let rawBody: string;
    try {
        rawBody = await req.text();
    } catch (e) {
        console.error("[Webhook] Failed to read body", e);
        return errorRedirect(req, 400, "Invalid body");
    }
    let event;
    try {
        event = await constructWebhookEvent(rawBody, signature);
        console.log("[Webhook] Signature verified");
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Webhook signature verification failed";
        console.error("[Webhook] Signature verification failed", e);
        return errorRedirect(req, 400, message);
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
                return errorRedirect(req, 500, "Processing failed");
            }
        }
    }
    return NextResponse.json({ received: true });
}

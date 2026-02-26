import Stripe from "stripe";
import { APP_URL } from "@/lib/config";
import { createTransaction, updateUserPlan } from "./billing-repo";

function getStripe(): Stripe {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    return new Stripe(key);
}

const PRO_PRICE_AMOUNT = 2900;

export async function createCheckoutSession(userId: string, userEmail: string) {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: userEmail,
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Pro Plan — Monthly",
                        description: "Unlimited calls, CRM, Analytics, BYOK, Priority support",
                    },
                    unit_amount: PRO_PRICE_AMOUNT,
                },
                quantity: 1,
            },
        ],
        success_url: `${APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${APP_URL}/dashboard/billing?canceled=true`,
        metadata: { userId },
    });
    return session;
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId as string | undefined;
    if (!userId) return;
    await createTransaction({
        user_id: userId,
        amount: (session.amount_total ?? PRO_PRICE_AMOUNT) / 100,
        method: "stripe",
        status: "completed",
        transaction_id: session.payment_intent as string || session.id,
    });
    await updateUserPlan(userId, "pro");
}

export async function constructWebhookEvent(payload: string | Buffer, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    return getStripe().webhooks.constructEvent(payload, signature, secret);
}

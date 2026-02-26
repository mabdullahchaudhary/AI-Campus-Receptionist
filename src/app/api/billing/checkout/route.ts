import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/features/billing/stripe";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const stripeSession = await createCheckoutSession(session.user.id, session.user.email);
        return NextResponse.json({ url: stripeSession.url });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Checkout failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

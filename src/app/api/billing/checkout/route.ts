import { NextResponse } from "next/server";
import { errorRedirect } from "@/lib/error-redirect";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/features/billing/stripe";

export async function POST() {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
        return errorRedirect({ headers: { get: () => "text/html" } } as any, 401, "Unauthorized");
    }
    try {
        const stripeSession = await createCheckoutSession(session.user.id, session.user.email);
        return NextResponse.json({ url: stripeSession.url });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Checkout failed";
        return errorRedirect({ headers: { get: () => "text/html" } } as any, 500, message);
    }
}

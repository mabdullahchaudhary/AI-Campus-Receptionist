import { NextResponse } from "next/server";

/**
 * Redirects to a custom error page for browser requests, or returns JSON for API clients.
 * Usage: return errorRedirect(req, 403, "Not authorized as admin");
 */
export function errorRedirect(req: Request, code: number, message: string) {
    const accept = req.headers.get("accept") || "";
    if (accept.includes("text/html")) {
        // For browser requests, redirect to the error page
        return NextResponse.redirect(`/errors/${code}`);
    }
    // For API clients, return JSON
    return NextResponse.json({ error: message }, { status: code });
}

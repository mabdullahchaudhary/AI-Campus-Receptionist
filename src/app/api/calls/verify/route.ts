import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        const body = await req.json();
        const { fingerprint, deviceInfo } = body;

        const userId = session?.user?.id || null;
        const plan = (session?.user?.plan as string) || "free";
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "0.0.0.0";

        // Plan limits — based on SECONDS not call count
        const limits: Record<string, { maxSeconds: number; maxCallAttempts: number }> = {
            free: { maxSeconds: 120, maxCallAttempts: 10 },       // 2 minutes total, up to 10 attempts
            pro: { maxSeconds: 3600, maxCallAttempts: 1000 },     // 60 minutes total
            enterprise: { maxSeconds: 7200, maxCallAttempts: 99999 },
        };

        const { maxSeconds, maxCallAttempts } = limits[plan] || limits.free;
        const today = new Date().toISOString().split("T")[0];

        // ===== LAYER 1: Authentication =====
        const layer1 = {
            name: "Authentication",
            status: "passed" as string,
            detail: "",
        };

        if (!session?.user) {
            layer1.status = "warning";
            layer1.detail = "Guest user — limited access";
        } else {
            layer1.status = "passed";
            layer1.detail = `Authenticated as ${session.user.email}`;
        }

        // ===== LAYER 2: Account Standing =====
        const layer2 = {
            name: "Account Standing",
            status: "passed" as string,
            detail: "",
        };

        if (userId) {
            const { data: user } = await supabase
                .from("platform_users")
                .select("plan, is_admin, subscription_status")
                .eq("id", userId)
                .single();

            if (user) {
                layer2.status = "passed";
                layer2.detail = `${user.plan.toUpperCase()} plan • Active`;
            } else {
                layer2.status = "warning";
                layer2.detail = "Account not found in database";
            }
        } else {
            layer2.status = "warning";
            layer2.detail = "No account linked";
        }

        // ===== LAYER 3: Network — Check by IP (SECONDS used, not call count) =====
        const layer3 = {
            name: "Network Verification",
            status: "passed" as string,
            detail: "",
        };

        const { data: ipUsage } = await supabase
            .from("daily_usage")
            .select("call_count, total_seconds")
            .eq("identity_key", ip)
            .eq("identity_type", "ip")
            .eq("usage_date", today)
            .single();

        const ipSeconds = ipUsage?.total_seconds || 0;
        const ipCalls = ipUsage?.call_count || 0;
        const ipSecondsRemaining = Math.max(0, maxSeconds - ipSeconds);

        if (ipSeconds >= maxSeconds) {
            layer3.status = "failed";
            layer3.detail = `Time limit reached — ${Math.floor(ipSeconds / 60)}m ${ipSeconds % 60}s / ${Math.floor(maxSeconds / 60)}m used from this network`;
        } else if (ipCalls >= maxCallAttempts) {
            layer3.status = "failed";
            layer3.detail = `Too many call attempts today (${ipCalls}/${maxCallAttempts})`;
        } else {
            layer3.status = "passed";
            layer3.detail = `${Math.floor(ipSecondsRemaining / 60)}m ${ipSecondsRemaining % 60}s remaining from this network`;
        }

        // ===== LAYER 4: Device Fingerprint (SECONDS used, not call count) =====
        const layer4 = {
            name: "Device Recognition",
            status: "passed" as string,
            detail: "",
        };

        let fpSecondsRemaining = maxSeconds;

        if (fingerprint) {
            // Upsert fingerprint record
            await supabase.from("device_fingerprints").upsert(
                {
                    fingerprint_hash: fingerprint,
                    user_id: userId,
                    ip_address: ip,
                    user_agent: deviceInfo?.userAgent?.substring(0, 500) || "",
                    screen_resolution: deviceInfo?.screenResolution || "",
                    timezone: deviceInfo?.timezone || "",
                    language: deviceInfo?.language || "",
                    platform: deviceInfo?.platform || "",
                    last_seen_at: new Date().toISOString(),
                },
                { onConflict: "fingerprint_hash" }
            );

            // Check if device is blocked
            const { data: fp } = await supabase
                .from("device_fingerprints")
                .select("is_blocked")
                .eq("fingerprint_hash", fingerprint)
                .single();

            if (fp?.is_blocked) {
                layer4.status = "failed";
                layer4.detail = "This device has been flagged and blocked";
            } else {
                // Check daily seconds used by this fingerprint
                const { data: fpUsage } = await supabase
                    .from("daily_usage")
                    .select("call_count, total_seconds")
                    .eq("identity_key", fingerprint)
                    .eq("identity_type", "fingerprint")
                    .eq("usage_date", today)
                    .single();

                const fpSeconds = fpUsage?.total_seconds || 0;
                const fpCalls = fpUsage?.call_count || 0;
                fpSecondsRemaining = Math.max(0, maxSeconds - fpSeconds);

                if (fpSeconds >= maxSeconds) {
                    layer4.status = "failed";
                    layer4.detail = `Device time limit reached — ${Math.floor(fpSeconds / 60)}m ${fpSeconds % 60}s / ${Math.floor(maxSeconds / 60)}m used`;
                } else if (fpCalls >= maxCallAttempts) {
                    layer4.status = "failed";
                    layer4.detail = `Too many attempts from this device (${fpCalls}/${maxCallAttempts})`;
                } else {
                    layer4.status = "passed";
                    layer4.detail = `Device verified • ${Math.floor(fpSecondsRemaining / 60)}m ${fpSecondsRemaining % 60}s remaining`;
                }
            }
        } else {
            layer4.status = "warning";
            layer4.detail = "Could not generate device fingerprint";
        }

        // ===== LAYER 5: Abuse Detection =====
        const layer5 = {
            name: "Abuse Detection",
            status: "passed" as string,
            detail: "",
        };

        const { data: ipFingerprints } = await supabase
            .from("device_fingerprints")
            .select("fingerprint_hash")
            .eq("ip_address", ip);

        const uniqueDevices = ipFingerprints?.length || 0;

        if (uniqueDevices > 10) {
            layer5.status = "failed";
            layer5.detail = `Suspicious: ${uniqueDevices} different devices from same network`;
        } else if (uniqueDevices > 5) {
            layer5.status = "warning";
            layer5.detail = `${uniqueDevices} devices detected from this network`;
        } else {
            layer5.status = "passed";
            layer5.detail = "No suspicious patterns detected";
        }

        // ===== LAYER 6: Service Availability =====
        const layer6 = {
            name: "Service Availability",
            status: "passed" as string,
            detail: "",
        };

        // Check for custom provider accounts
        const { data: activeProvider } = await supabase
            .from("credit_providers")
            .select("*")
            .eq("is_active", true)
            .gt("credits_remaining", 0.5)
            .order("priority", { ascending: true })
            .limit(1)
            .single();

        if (activeProvider) {
            layer6.status = "passed";
            layer6.detail = `Provider ready • ${activeProvider.credits_remaining} credits remaining`;
        } else {
            // Fall back to default Vapi key from env
            const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
            if (vapiKey) {
                layer6.status = "passed";
                layer6.detail = "Primary voice provider ready";
            } else {
                layer6.status = "failed";
                layer6.detail = "No voice provider configured";
            }
        }

        // ===== FINAL DECISION =====
        const layers = [layer1, layer2, layer3, layer4, layer5, layer6];
        const hasFailed = layers.some((l) => l.status === "failed");
        const isAllowed = !hasFailed;

        // Calculate actual remaining seconds (minimum of all layers)
        const actualSecondsRemaining = Math.min(ipSecondsRemaining, fpSecondsRemaining);

        return NextResponse.json({
            allowed: isAllowed,
            plan,
            maxDurationSeconds: actualSecondsRemaining,
            totalAllowedSeconds: maxSeconds,
            secondsUsedToday: Math.max(ipUsage?.total_seconds || 0, 0),
            secondsRemaining: actualSecondsRemaining,
            layers,
            activeProvider: activeProvider
                ? {
                    provider: activeProvider.provider,
                    publicKey: activeProvider.api_key_public,
                }
                : null,
        });
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json(
            {
                allowed: false,
                plan: "free",
                maxDurationSeconds: 120,
                totalAllowedSeconds: 120,
                secondsUsedToday: 0,
                secondsRemaining: 0,
                layers: [
                    {
                        name: "System",
                        status: "failed",
                        detail: "Verification system error — please try again",
                    },
                ],
            },
            { status: 500 }
        );
    }
}
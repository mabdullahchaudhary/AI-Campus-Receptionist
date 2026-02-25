// Stub for analytics event tracking utility
// Extend with Mixpanel, PostHog, or Vercel Analytics as needed

export function trackEvent(event: string, data?: Record<string, any>) {
  // TODO: Integrate real analytics provider
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data);
  }
}

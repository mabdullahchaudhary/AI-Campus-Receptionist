"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import CleanupAttrs from "@/components/shared/CleanupAttrs";
import SiteStagePopup from "@/components/shared/SiteStagePopup";

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextAuthSessionProvider>
            {children}
            <CleanupAttrs />
            <SiteStagePopup />
        </NextAuthSessionProvider>
    );
}
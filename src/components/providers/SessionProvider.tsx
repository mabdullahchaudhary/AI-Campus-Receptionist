"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import CleanupAttrs from "@/components/Client/CleanupAttrs";
import SiteStagePopup from "@/components/Client/SiteStagePopup";

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
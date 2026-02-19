import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            plan: string;
            isAdmin: boolean;
            clientId: string;
            maxCallsPerDay: number;
            maxCallDuration: number;
            onboardingCompleted: boolean;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        plan?: string;
        isAdmin?: boolean;
        clientId?: string;
        maxCallsPerDay?: number;
        maxCallDuration?: number;
        onboardingCompleted?: boolean;
    }
}
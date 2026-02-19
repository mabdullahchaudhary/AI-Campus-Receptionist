import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabase } from "./supabase";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!account || account.provider !== "google") return false;

            try {
                // Check if user exists
                const { data: existingUser } = await supabase
                    .from("platform_users")
                    .select("*")
                    .eq("google_id", account.providerAccountId)
                    .single();

                if (existingUser) {
                    // Update last login
                    await supabase
                        .from("platform_users")
                        .update({ last_login_at: new Date().toISOString() })
                        .eq("google_id", account.providerAccountId);
                } else {
                    // Create new user
                    await supabase.from("platform_users").insert({
                        google_id: account.providerAccountId,
                        email: user.email!,
                        full_name: user.name || "User",
                        avatar_url: user.image || "",
                        plan: "free",
                    });
                }

                return true;
            } catch (error) {
                console.error("Sign in error:", error);
                return true; // Still allow sign in even if DB write fails
            }
        },

        async jwt({ token, account, user }) {
            if (account && user) {
                // Fetch user data from our database
                const { data: dbUser } = await supabase
                    .from("platform_users")
                    .select("*")
                    .eq("email", user.email!)
                    .single();

                if (dbUser) {
                    token.userId = dbUser.id;
                    token.plan = dbUser.plan;
                    token.isAdmin = dbUser.is_admin;
                    token.clientId = dbUser.client_id;
                    token.maxCallsPerDay = dbUser.max_calls_per_day;
                    token.maxCallDuration = dbUser.max_call_duration_seconds;
                    token.onboardingCompleted = dbUser.onboarding_completed;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId as string;
                session.user.plan = token.plan as string;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.clientId = token.clientId as string;
                session.user.maxCallsPerDay = token.maxCallsPerDay as number;
                session.user.maxCallDuration = token.maxCallDuration as number;
                session.user.onboardingCompleted = token.onboardingCompleted as boolean;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
});
"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-heading font-extrabold">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 space-y-6"
            >
                {/* Profile */}
                <div className="p-6 rounded-2xl glass">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-5 h-5 text-violet-400" />
                        <h2 className="text-lg font-heading font-bold">Profile</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="" className="w-16 h-16 rounded-2xl" />
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                                {session?.user?.name?.charAt(0)}
                            </div>
                        )}
                        <div>
                            <p className="font-heading font-bold text-lg">{session?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 rounded-2xl glass">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-violet-400" />
                        <h2 className="text-lg font-heading font-bold">Security</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        You are signed in with Google OAuth. Your account security is managed by Google.
                    </p>
                </div>

                {/* Notifications */}
                <div className="p-6 rounded-2xl glass">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-5 h-5 text-violet-400" />
                        <h2 className="text-lg font-heading font-bold">Notifications</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Email notification settings will be available with the Pro plan.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
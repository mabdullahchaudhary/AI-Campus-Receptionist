"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function CallsPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-heading font-extrabold">Call History</h1>
                <p className="text-muted-foreground mt-1">View and manage all your AI receptionist calls.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-8 p-16 rounded-2xl glass text-center"
            >
                <Phone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-heading font-bold">No calls yet</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Once your AI receptionist starts taking calls, they will appear here with full transcripts.
                </p>
            </motion.div>
        </div>
    );
}
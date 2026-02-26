import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Superior AI",
};

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <p className="mb-4">Welcome to Superior AI. By using our service, you agree to the following terms and conditions. Please read them carefully.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
            <p className="mb-4">You agree to use Superior AI only for lawful purposes and in accordance with these Terms.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">2. Data & Privacy</h2>
            <p className="mb-4">We collect and process your data as described in our Privacy Policy. You retain ownership of your data.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">3. Account Security</h2>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your account and password.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">4. Limitation of Liability</h2>
            <p className="mb-4">Superior AI is provided "as is" without warranties. We are not liable for any damages arising from use of the service.</p>
            <h2 className="text-xl font-semibold mt-8 mb-2">5. Changes</h2>
            <p className="mb-4">We may update these Terms at any time. Continued use of the service constitutes acceptance of the new Terms.</p>
            <p className="mt-8 text-sm text-gray-500">Last updated: February 2026</p>
        </main>
    );
}


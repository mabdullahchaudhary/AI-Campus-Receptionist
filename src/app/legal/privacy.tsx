import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | Superior AI",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Superior AI is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-4">We collect information you provide directly, such as your name, email, and call data, as well as technical data like IP address and device info.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. How We Use Information</h2>
      <p className="mb-4">We use your information to provide and improve our services, for analytics, and to communicate with you.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Security</h2>
      <p className="mb-4">We implement industry-standard security measures to protect your data. All sensitive data is encrypted in transit and at rest.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Third-Party Services</h2>
      <p className="mb-4">We may share data with trusted third parties for service delivery (e.g., Vapi, Supabase) but never sell your data.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights</h2>
      <p className="mb-4">You may request access, correction, or deletion of your data at any time by contacting us.</p>
      <p className="mt-8 text-sm text-gray-500">Last updated: February 2026</p>
    </main>
  );
}

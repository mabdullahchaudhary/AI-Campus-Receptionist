import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/landing/Footer";
import { 
  Database, 
  Activity, 
  Network, 
  Shield, 
  UserCheck, 
  Cookie, 
  Globe, 
  Mail,
  ArrowLeft
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Superior AI",
  description: "Learn how Superior AI collects, uses, and protects your data.",
};

const privacyData = [
  {
    id: "what-we-collect",
    title: "What We Collect",
    icon: Database,
    content: "We collect information you provide (contact details, account info), usage data (logs, interactions), and technical data (IP, device, browser)."
  },
  {
    id: "how-we-use",
    title: "How We Use Data",
    icon: Activity,
    content: "We use data to operate the service, improve product features, provide support, detect abuse, and comply with legal obligations."
  },
  {
    id: "sharing",
    title: "Sharing & Third Parties",
    icon: Network,
    content: "We may share data with service providers (Vapi, Deepgram, Supabase) to deliver features. We do not sell personal data."
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    content: "We employ industry-standard safeguards including encryption in transit and at rest, access controls, and monitoring."
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: UserCheck,
    content: "You can request access, correction, or deletion of your personal data. Contact info@superior.edu.pk for requests."
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Cookie,
    content: "We use cookies and similar technologies for analytics and session management. You can manage preferences in your browser."
  },
  {
    id: "international",
    title: "International Transfers",
    icon: Globe,
    content: "Data may be processed in countries outside your jurisdiction. We take measures to maintain appropriate protections."
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
    content: "Questions about this policy? Reach out at info@superior.edu.pk."
  }
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      
      {/* Top Navigation Bar with Back Button */}
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link 
            href="/" 
            className="group inline-flex items-center text-sm font-medium text-slate-500 hover:text-violet-600 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 group-hover:bg-violet-50 mr-3 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white border-b border-slate-200 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-violet-600 ring-1 ring-inset ring-violet-600/20 mb-6 bg-violet-50">
            Data Protection
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            We respect your privacy. This policy explains what data we collect, why we collect it, and how you can control it.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Last updated: February 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Navigation
                </h3>
                <nav className="flex flex-col space-y-1">
                  {privacyData.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:text-violet-700 hover:bg-violet-50 transition-all duration-200"
                    >
                      <section.icon className="w-4 h-4 mr-3 text-slate-400 group-hover:text-violet-600 transition-colors" />
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <div className="flex-1 max-w-4xl">
            <div className="space-y-12">
              {privacyData.map((section, index) => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className="scroll-mt-32 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-violet-600 mb-1 block">
                        Section 0{index + 1}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed">
                    <p>{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
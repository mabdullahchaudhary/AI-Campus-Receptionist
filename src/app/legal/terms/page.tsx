import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { 
  ShieldCheck, 
  Bot, 
  KeyRound, 
  CheckCircle2, 
  CreditCard, 
  Shield, 
  AlertTriangle, 
  Ban, 
  RefreshCw, 
  Mail 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Superior AI",
  description: "Terms of service and usage guidelines for Superior AI.",
};

const termsData = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: ShieldCheck,
    content: "By accessing or using our services, you agree to be bound by these Terms and any policies referenced herein. If you do not agree to all the terms and conditions, you must not use our services."
  },
  {
    id: "service",
    title: "Service Description",
    icon: Bot,
    content: "Superior AI provides advanced AI voice receptionist solutions and related infrastructure. Services encompass web widgets, API access, analytical dashboards, and integrations with selected third-party communication providers."
  },
  {
    id: "accounts",
    title: "Accounts and Security",
    icon: KeyRound,
    content: "You are strictly responsible for maintaining the confidentiality of your account credentials. You must immediately notify Superior AI of any unauthorized use of your account or any other breach of security."
  },
  {
    id: "use",
    title: "Permitted Use & Restrictions",
    icon: CheckCircle2,
    content: "You agree not to use the services for unlawful activities, to infringe upon intellectual property rights, or to deploy harmful code. Superior AI reserves the right to immediately suspend accounts found violating these parameters."
  },
  {
    id: "fees",
    title: "Fees & Billing",
    icon: CreditCard,
    content: "Pricing and billing cycles are transparently outlined on our Pricing page. You are responsible for the timely payment of all applicable fees. Failure to settle balances may result in service interruption."
  },
  {
    id: "data",
    title: "Data & Privacy",
    icon: Shield,
    content: "Your data privacy is paramount. We collect, process, and protect your information strictly in accordance with our Privacy Policy. You retain full ownership of all proprietary data fed into our systems."
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: AlertTriangle,
    content: "To the maximum extent permitted by applicable law, Superior AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities."
  },
  {
    id: "termination",
    title: "Termination",
    icon: Ban,
    content: "We reserve the right to suspend or terminate your access for material breach of these Terms. You maintain the right to terminate your account at any time by contacting our support infrastructure."
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: RefreshCw,
    content: "We may systematically modify these Terms as our platform evolves. We will provide appropriate notice of significant changes. Continued utilization of the service constitutes formal acceptance of updated terms."
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: Mail,
    content: "For legal inquiries or questions regarding these Terms, please contact our administrative team directly at info@superior.edu.pk."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      <Navbar />

      <div className="relative overflow-hidden bg-white border-b border-slate-200 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-violet-600 ring-1 ring-inset ring-violet-600/20 mb-6 bg-violet-50">
            Legal Information
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            These terms govern your access to and use of Superior AI products. They form a binding legal agreement designed to protect both you and our platform.
          </p>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Last updated: February 2026
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Navigation
                </h3>
                <nav className="flex flex-col space-y-1">
                  {termsData.map((section) => (
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
              {termsData.map((section, index) => (
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
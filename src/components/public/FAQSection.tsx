"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

const faqCategories = [
  {
    name: "General",
    faqs: [
      { q: "What is Superior AI?", a: "Superior AI is an enterprise-grade AI voice receptionist built specifically for Superior University, Lahore. It answers calls 24/7, handles admissions inquiries, fee questions, scholarship checks, campus visits, and 16 more tasks — all automatically in English, Urdu, and Urdlish." },
      { q: "Who built this project?", a: "This is a university project built by a team of 6 students from Superior University. Abdullah leads the development, with Hamid on backend, Arooj on design, Amara on frontend, Mehwish on AI training, and Zari on documentation." },
      { q: "Is this a real product or just a demo?", a: "It's a fully functional product. Riley can take real voice calls, search a live knowledge base, save contacts, book appointments, score leads, and provide analytics — all deployed and running on Vercel." },
      { q: "Does the caller need to login or download anything?", a: "No. Callers simply click the 'Call Now' button on your website and start talking immediately. No login, no app download, no forms. Completely frictionless — just like calling a phone number." },
    ],
  },
  {
    name: "AI & Voice",
    faqs: [
      { q: "What AI model does Riley use?", a: "Riley uses Groq's Llama 3.1 8B model for ultra-fast AI responses (under 750ms). Voice is handled by Vapi with the Elliot voice, and speech-to-text uses Deepgram's Nova-2 model for accurate transcription." },
      { q: "What languages does Riley support?", a: "Riley supports English, Urdu, and mixed Urdu-English (Urdlish). It automatically detects which language the caller is using from their first sentence and responds naturally in the same language throughout the call." },
      { q: "What are the 16 AI tools?", a: "Riley has: check_knowledge, check_fee, check_scholarship, check_hostel, check_transport, check_campus, check_faq, check_departments, check_admission_status, save_contact, book_visit, detect_returning, score_lead, schedule_callback, transfer_human, and end_conversation. Each activates automatically based on conversation context." },
      { q: "How accurate are Riley's responses?", a: "Riley answers from your knowledge base, so accuracy depends on the data you provide. With proper training data, accuracy is 95%+. Riley never makes up information — if something isn't in the knowledge base, it will say so honestly." },
      { q: "Can Riley detect returning callers?", a: "Yes. The detect_returning tool checks if a phone number has called before and personalizes the greeting ��� for example: 'Welcome back, Ahmed! Last time you asked about BS Computer Science. Any updates?'" },
    ],
  },
  {
    name: "Features",
    faqs: [
      { q: "How does the Knowledge Base work?", a: "The Knowledge Base is a full CRUD interface where you add university information — fees, departments, scholarships, hostel details, etc. Riley searches this data in real-time when callers ask questions. Pro plan users can add, edit, and delete entries. Free plan users can view only." },
      { q: "How does lead scoring work?", a: "After each call, Riley automatically rates the caller as Hot (very interested, ready to apply), Warm (interested but undecided), or Cold (just browsing). This helps your team prioritize follow-up calls and focus on the most promising leads." },
      { q: "How does the Contact CRM work?", a: "When callers share their name, phone, or email during natural conversation, Riley saves it automatically. It never asks for all details at once — it asks name first, then phone separately. All contacts appear in your dashboard with lead scores and call history." },
      { q: "Can callers book campus visits through Riley?", a: "Yes. When a caller expresses interest in visiting, Riley collects their name, phone, preferred department, and date/time — then saves the appointment. All bookings show up in the Appointments section of your dashboard." },
      { q: "What happens if the caller gets frustrated?", a: "Riley has a transfer_human tool that activates when it detects frustration or when the caller explicitly asks for a real person. It smoothly transfers the call and also provides the university phone number (042-35761999) as a direct fallback." },
      { q: "Does Riley handle callback requests?", a: "Yes. If a caller says 'Can someone call me back?', Riley uses the schedule_callback tool to record their name, phone number, reason, and preferred time. These appear in your admin dashboard for staff follow-up." },
    ],
  },
  {
    name: "Plans & Pricing",
    faqs: [
      { q: "Is the Free plan really free?", a: "Yes, completely free forever. You get 1 call per day with a 2-minute limit, all 16 AI tools, 3 languages, basic call history, live transcripts, and 6-layer security. No credit card required to sign up." },
      { q: "What does the Pro plan ($29/month) include?", a: "Pro unlocks: unlimited calls, 60-minute daily limit, full call history with AI summaries, Knowledge Base CRUD, Contact CRM with lead scoring, campus visit appointments, analytics dashboard, BYOK (bring your own API keys), callback scheduling, and CSV export." },
      { q: "What's in the Enterprise plan ($99/month)?", a: "Enterprise includes everything in Pro plus: unlimited call duration, custom phone number via Twilio, custom AI voice, multi-account provider rotation, white-label branding, REST API access, WhatsApp/SMS integration, team management, dedicated account manager, and 99.9% SLA." },
      { q: "What is BYOK (Bring Your Own Keys)?", a: "BYOK lets you add your own Vapi and Groq API keys in the Pro plan. When you use your own keys, calls consume YOUR credits instead of ours — giving you unlimited calls without plan restrictions. Keys are encrypted with AES-256." },
      { q: "Can I cancel anytime?", a: "Yes, there are no long-term contracts. You can cancel your Pro or Enterprise subscription anytime. Your account will revert to the Free plan at the end of your billing period." },
    ],
  },
  {
    name: "Security & Technical",
    faqs: [
      { q: "How secure is Superior AI?", a: "We use 6-layer security: (1) Google OAuth authentication, (2) Device fingerprinting, (3) IP-based rate limiting, (4) Daily usage tracking, (5) Fraud detection, and (6) Encrypted API key storage. All data is stored in Supabase with row-level security." },
      { q: "What tech stack is used?", a: "Frontend: Next.js 16 + TypeScript + Tailwind CSS. Backend: Supabase (PostgreSQL). AI: Groq (Llama 3.1 8B). Voice: Vapi + Elliot voice. Transcription: Deepgram Nova-2. Automation: n8n. Hosting: Vercel. All connected through 12+ API routes." },
      { q: "What happens when Vapi credits run out?", a: "We have a multi-account provider rotation system. 10+ Vapi accounts are configured. When one account's credits run out, the system automatically switches to the next account. Zero downtime, zero missed calls. Credits are checked every 15 minutes." },
      { q: "Is the data encrypted?", a: "Yes. All data is encrypted in transit (HTTPS/TLS). API keys stored via BYOK are encrypted with AES-256 before storage. Supabase provides encryption at rest. Call transcripts and contact data are stored securely with row-level security policies." },
      { q: "Can multiple universities use this?", a: "Currently it's built for Superior University, but the architecture supports multi-tenant deployment. The Enterprise plan roadmap includes multi-university support with isolated environments and custom branding per institution." },
    ],
  },
];

export default function FAQSection() {
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const activeFaqs = faqCategories.find((c) => c.name === activeCategory)?.faqs || [];

  const handleToggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const handleCategoryChange = (name: string) => {
    setActiveCategory(name);
    setOpenIndex(null);
  };

  return (
    <section id="faq" ref={ref} className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-[12px] font-bold uppercase tracking-wider mb-5">
            FAQ
          </span>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-heading font-extrabold tracking-tight leading-tight">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-[15px] text-gray-500 mt-3">Everything you need to know about Superior AI and Riley</p>
        </div>

        {/* Category Tabs */}
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {faqCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-300 shrink-0 ${activeCategory === cat.name
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-white text-gray-500 border border-gray-200/60 hover:bg-gray-50 hover:text-gray-700"
                }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-[10px] ${activeCategory === cat.name ? "text-violet-200" : "text-gray-300"}`}>
                {cat.faqs.length}
              </span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className={`space-y-3 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {activeFaqs.map((faq, i) => (
            <div
              key={`${activeCategory}-${i}`}
              className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${openIndex === i
                ? "border-violet-200 shadow-lg shadow-violet-500/5"
                : "border-gray-200/60 shadow-card hover:shadow-card-hover"
                }`}
            >
              <button
                onClick={() => handleToggle(i)}
                className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
              >
                {/* Number */}
                <span className={`text-[12px] font-bold shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 ${openIndex === i ? "bg-violet-100 text-violet-700" : "bg-gray-50 text-gray-400"
                  }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span className={`flex-1 text-[14px] font-semibold transition-colors duration-300 ${openIndex === i ? "text-violet-700" : "text-gray-700"
                  }`}>
                  {faq.q}
                </span>

                {/* Toggle */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${openIndex === i ? "bg-violet-100 text-violet-600" : "bg-gray-50 text-gray-400"
                  }`}>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pl-[52px] sm:pl-[60px]">
                  <p className="text-[13.5px] text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom help */}
        <div className={`mt-10 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/20 flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="w-7 h-7 text-violet-400" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-white text-[16px] font-heading font-bold">Still have questions?</p>
              <p className="text-white/40 text-[13px] mt-0.5">Our team is happy to help. Reach out anytime.</p>
            </div>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-6 py-3 rounded-xl bg-white text-gray-900 text-[13.5px] font-bold hover:bg-gray-100 transition-colors shrink-0"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/HeroSection";
import Features from "@/components/public/FeaturesSection";
import HowItWorks from "@/components/public/HowItWorks";
import Pricing from "@/components/public/PricingSection";
import Team from "@/components/public/TeamSection";
import FAQ from "@/components/public/FAQSection";
import Footer from "@/components/public/Footer";
import AboutProjectSection from "@/components/public/AboutProjectSection";
import ContactSection from "@/components/public/ContactSection";
import BusinessStats from "@/components/public/BusinessStats";
import Customers from "@/components/public/Customers";
import AnimatedCounters from "@/components/public/AnimatedCounters";
import CaseStudies from "@/components/public/CaseStudies";
import SecurityBadges from "@/components/public/SecurityBadges";
import PressSection from "@/components/public/PressSection";

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <AboutProjectSection />
            <Features />
            <Customers />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <BusinessStats />
            </div>
            <AnimatedCounters />
            <SecurityBadges />
            <CaseStudies />
            <PressSection />
            <Pricing />
            <HowItWorks />
            <Team />
            <FAQ />
            <ContactSection />
            <Footer />
        </main>
    );
}

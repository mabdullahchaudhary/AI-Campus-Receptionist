import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/HeroSection";
import Features from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/PricingSection";
import Team from "@/components/landing/TeamSection";
import FAQ from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";
import AboutProjectSection from "@/components/landing/AboutProjectSection";
import ContactSection from "@/components/landing/ContactSection";
import BusinessStats from "@/components/landing/BusinessStats";
import Customers from "@/components/landing/Customers";
import AnimatedCounters from "@/components/landing/AnimatedCounters";
import CaseStudies from "@/components/landing/CaseStudies";
import SecurityBadges from "@/components/landing/SecurityBadges";
import PressSection from "@/components/landing/PressSection";

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
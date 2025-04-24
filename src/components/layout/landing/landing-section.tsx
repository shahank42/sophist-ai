// components/landing/LandingPage.tsx
import HeroSection from "@/components/layout/landing/hero-section-2";
import CallToAction from "./cta";
import FAQsThree from "./faqs-3";
import Features from "./features";
import Footer from "./footer";

export function LandingSection() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <Features />
      {/* <AppDemo /> */}
      {/* <TestimonialsSection /> */}
      <FAQsThree />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default LandingSection;

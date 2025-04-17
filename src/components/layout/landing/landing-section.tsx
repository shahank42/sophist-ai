// components/landing/LandingPage.tsx
import HeroSection from "@/components/layout/landing/hero-section-2";
import AppDemoSection from "./app-demo-section";
import CTASection from "./cta-section";
import Features from "./features";
import Footer from "./footer";
import TestimonialsSection from "./testimonials-section";

export function LandingSection() {
  return (
    <div className="relative">
      {/* <Navbar /> */}
      <HeroSection />
      {/* <FeaturesSection /> */}
      <Features />
      <AppDemoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingSection;

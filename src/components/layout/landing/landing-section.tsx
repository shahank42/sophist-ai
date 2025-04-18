// components/landing/LandingPage.tsx
import HeroSection from "@/components/layout/landing/hero-section-2";
import CallToAction from "./cta";
import Features from "./features";
import AppDemo from "./features-12";
import Footer from "./footer";
import TestimonialsSection from "./testimonials-section";

export function LandingSection() {
  return (
    <div className="relative">
      {/* <Navbar /> */}
      <HeroSection />
      {/* <FeaturesSection /> */}
      <Features />
      {/* <AppDemoSection /> */}
      <AppDemo />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default LandingSection;

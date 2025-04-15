// components/landing/LandingPage.tsx
import React from "react";
import Navbar from "./navbar";
import HeroSection from "./hero-section";
import FeaturesSection from "./features-section";
import AppDemoSection from "./app-demo-section";
import TestimonialsSection from "./testimonials-section";
import CTASection from "./cta-section";
import Footer from "./footer";

export function LandingSection() {
  return (
    <div className="relative">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AppDemoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingSection;

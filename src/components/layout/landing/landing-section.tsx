// components/landing/LandingPage.tsx
import HeroSection from "@/components/layout/landing/hero-section-2";
import CallToAction from "./cta";
import FAQsThree from "./faqs-3";
import Features from "./features";
import Footer from "./footer";
import AppDemo from "./features-12";
import VideoDemo from "./video-demo";

export function LandingSection() {
  return (
    <div className="relative w-full">
      <HeroSection />
      <Features />
      <VideoDemo />
      {/* <TestimonialsSection /> */}
      <FAQsThree />
      <CallToAction />
      <Footer />
    </div>
  );
}

export default LandingSection;

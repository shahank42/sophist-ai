// components/landing/AppDemoSection.tsx
import React from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import DemoFeature from "./demo-feature";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const containerVariantsMobile = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 18,
      mass: 0.7,
      duration: 0.28,
    },
  },
};

const itemVariantsMobile = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 18,
      mass: 0.7,
      duration: 0.16,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 54,
      damping: 16,
      mass: 0.7,
      duration: 0.32,
      delay: 0.09,
    },
  },
};

const imageVariantsMobile = {
  hidden: { opacity: 0, scale: 0.98, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 54,
      damping: 16,
      mass: 0.7,
      duration: 0.18,
      delay: 0.04,
    },
  },
};

const AppDemoSection = () => {
  // Use your useIsMobile hook
  const isMobile = useIsMobile();

  return (
    <motion.section
      className="py-12 sm:py-16 md:py-24"
      aria-labelledby="app-demo-title"
      role="region"
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.3 }}
      variants={isMobile ? containerVariantsMobile : containerVariants}
    >
      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1 px-1"
            variants={isMobile ? itemVariantsMobile : itemVariants}
          >
            <header>
              <h2
                id="app-demo-title"
                className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
              >
                See SophistAI in Action
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                Upload any syllabus and watch as our AI transforms it into an
                interactive knowledge map. Navigate through topics, get
                contextual information, and track your progress effortlessly.
              </p>
            </header>
            <motion.ol
              className="space-y-4 md:space-y-6"
              aria-label="Demo steps"
              variants={isMobile ? containerVariantsMobile : containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.3 }}
            >
              <motion.li
                variants={isMobile ? itemVariantsMobile : itemVariants}
              >
                <DemoFeature
                  number="01"
                  title="Upload Your Syllabus"
                  description="Just paste your syllabus text - formatting doesn't matter."
                />
              </motion.li>
              <motion.li
                variants={isMobile ? itemVariantsMobile : itemVariants}
              >
                <DemoFeature
                  number="02"
                  title="Explore Your Knowledge Map"
                  description="Navigate through topics and subtopics in an intuitive interface."
                />
              </motion.li>
              <motion.li
                variants={isMobile ? itemVariantsMobile : itemVariants}
              >
                <DemoFeature
                  number="03"
                  title="Master One Topic at a Time"
                  description="Study efficiently with contextual content and progress tracking."
                />
              </motion.li>
            </motion.ol>
            <motion.div
              className="mt-6 md:mt-8"
              variants={isMobile ? itemVariantsMobile : itemVariants}
            >
              <Button
                variant={"secondary"}
                className="text-lg"
                size={"lg"}
                asChild
              >
                <a href="#get-started" aria-label="Get started with SophistAI">
                  Get Started
                </a>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2 relative mx-auto w-[90%] lg:w-full max-w-xl"
            variants={isMobile ? imageVariantsMobile : imageVariants}
          >
            <figure className="aspect-square relative rounded-2xl border border-border shadow-xl">
              <Card className="w-full h-full p-0 border-none shadow-none">
                <CardContent className="p-0">
                  <img
                    src="/screenshots/mind-map-demo.png"
                    alt="Screenshot of SophistAI Knowledge Map"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </CardContent>
              </Card>
              <figcaption>
                <Badge
                  className="absolute -bottom-4 md:-bottom-6 right-0 md:-right-6 bg-primary text-primary-foreground p-3 md:p-4 rounded-lg shadow-lg flex flex-col items-start text-sm md:text-md max-w-[90%] md:max-w-none"
                  aria-label="Interactive Concept Maps"
                >
                  <span className="font-bold">Navigate Your Knowledge</span>
                  <span className="text-xs md:text-sm opacity-80">
                    With Interactive Concept Maps
                  </span>
                </Badge>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </MaxWidthWrapper>
    </motion.section>
  );
};

export default AppDemoSection;

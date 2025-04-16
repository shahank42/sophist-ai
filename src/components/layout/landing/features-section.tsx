// components/landing/FeaturesSection.tsx
import React from "react";
import { Brain, BookOpen, Check, GitBranch } from "lucide-react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import FeatureCard from "./feature-card";

const features = [
  {
    icon: <Brain className="w-7 h-7" />,
    title: "Interactive Mind Map",
    description:
      "Transform your syllabus into a navigable tree of connected concepts.",
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: "Contextual Articles",
    description:
      "Get detailed articles tailored to each topic, aligned with your progress.",
  },
  {
    icon: <Check className="w-7 h-7" />,
    title: "Smart Progress Tracking",
    description: "Mark topics as completed and watch your knowledge grow.",
  },
  {
    icon: <GitBranch className="w-7 h-7" />,
    title: "Deep Dive",
    description:
      "Generate subtopics instantly while keeping the big picture in sight.",
  },
];

const FeaturesSection = () => {
  return (
    <section
      className="py-12 sm:py-20 bg-muted/30"
      aria-labelledby="features-heading"
    >
      <MaxWidthWrapper className="px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
          >
            Transform Your Study Experience
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            SophistAI turns chaotic study materials into structured, interactive
            knowledge maps.
          </p>
        </div>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8"
          role="list"
        >
          {features.map((feature, idx) => (
            <li key={feature.title} className="flex">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                rotate={idx % 2 === 0 ? "left" : "right"}
              />
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </section>
  );
};

export default FeaturesSection;

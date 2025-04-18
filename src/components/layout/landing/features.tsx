import { HyperText } from "@/components/magicui/hyper-text";
import {
  BookOpen,
  Brain,
  Check,
  GitBranch,
  Network,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="size-4" />,
    title: "Interactive Mind Map",
    description:
      "Transform your syllabus into a navigable tree of connected concepts.",
  },
  {
    icon: <BookOpen className="size-4" />,
    title: "Contextual Articles",
    description:
      "Get detailed articles tailored to each topic, aligned with your progress.",
  },
  {
    icon: <Check className="size-4" />,
    title: "Smart Progress Tracking",
    description: "Mark topics as completed and watch your knowledge grow.",
  },
  {
    icon: <GitBranch className="size-4" />,
    title: "Deep Dive",
    description:
      "Generate subtopics instantly while keeping the big picture in sight.",
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "Auto-Complete Progress",
    description:
      "Auto-completes child/parent topics — progress flows both ways!",
  },
  {
    icon: <Network className="size-4" />,
    title: "Big Picture Preservation",
    description:
      "Explore subtopics infinitely while maintaining an overview of your syllabus structure.",
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-4xl font-medium lg:text-5xl">
            <HyperText
              characterSet={"abcdefghijklmnopqrstuvwxyzAbcdefghijklmnopqrstuvwxyz".split(
                ""
              )}
              duration={1500}
              startOnView={true}
            >
              Transform Your Study Experience
            </HyperText>
          </h2>
          <p>
            SophistAI turns chaotic study materials into structured, interactive
            knowledge maps.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3">
              <div className="flex items-center gap-2">
                {feature.icon}
                <h3 className="text-sm font-medium">{feature.title}</h3>
              </div>
              <p className="text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

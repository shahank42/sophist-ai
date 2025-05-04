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
    title: "Visualize Your Syllabus Instantly", 
    description:
      "Transform syllabus confusion into a clear, interactive map showing how every topic connects.",
  },
  {
    icon: <BookOpen className="size-4" />,
    title: "Instant Topic Explanations", 
    description:
      "Get Instant, Clear Explanations for Any Topic on Your Syllabus – Right When You Need Them.",
  },
  {
    icon: <Check className="size-4" />,
    title: "Track Your Study Progress Visually",
    description:
      "Visually Track Your Study Progress & Know Exactly What to Focus on for Exams.",
  },
  {
    icon: <GitBranch className="size-4" />,
    title: "Explore Topics Deeper, Stay Oriented", 
    description:
      "Explore Complex Topics in Depth Without Losing Sight of the Big Picture.", 
  },
  {
    icon: <Sparkles className="size-4" />,
    title: "Effortless Progress Updates", 
    description:
      "Save time as your map automatically updates progress across related topics – up and down the structure.", 
  },
  {
    icon: <Network className="size-4" />,
    title: "Never Lose Your Place", 
    description:
      "Dive deep into any topic, confident you'll always see how it fits within your overall course structure.", 
  },
];

export default function Features() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
        <div className="relative z-10 mx-auto max-w-6xl space-y-6 text-center md:space-y-12">
          <h2 className="text-balance text-3xl font-medium lg:text-5xl">
            {/* <HyperText
              characterSet={"abcdefghijklmnopqrstuvwxyzAbcdefghijklmnopqrstuvwxyz".split(
                ""
              )}
              duration={1500}
              startOnView={true}
            >
              Transform Your Study Experience
            </HyperText> //TODO: fix the line glitch on mobile */}
            Transform Your Study Experience
          </h2>
          <p>
            SophistAI turns chaotic study materials into structured, interactive
            knowledge maps.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-6xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
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

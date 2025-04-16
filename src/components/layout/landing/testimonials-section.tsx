// components/landing/TestimonialsSection.tsx
import React from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import TestimonialCard from "./testimonial-card";

const testimonials = [
  {
    quote:
      "SophistAI helped me ace my finals. The interactive mind map made it so much easier to understand complex topics.",
    author: "Sarah K., Computer Science Student",
  },
  {
    quote:
      "I used to spend hours organizing study materials. Now I just upload my syllabus and SophistAI does the rest.",
    author: "James L., Medical Student",
  },
  {
    quote:
      "The progress tracking feature keeps me motivated. I can actually see how much I've learned.",
    author: "Emily T., MBA Student",
  },
  {
    quote:
      "The AI-generated quizzes are spot on. They really test my understanding and help me focus on weak areas.",
    author: "Priya S., Engineering Student",
  },
  {
    quote:
      "I love how clean and intuitive the interface is. It makes studying feel less overwhelming.",
    author: "Michael B., Law Student",
  },
  {
    quote:
      "SophistAI is like having a personal tutor available 24/7. My grades and confidence have both improved.",
    author: "Anna R., Psychology Student",
  },
];

// Generate a random rotation between -2.5 and 2.5 degrees for each testimonial, seeded by index for consistency
function getRotation(index: number) {
  const min = -2.0,
    max = 2.0;
  // Simple deterministic pseudo-random based on index
  const seed = Math.sin(index + 1) * 10000;
  const rand = seed - Math.floor(seed);
  return min + rand * (max - min);
}

const TestimonialsSection = () => {
  return (
    <section
      className="py-10 md:py-16 bg-muted/30"
      aria-labelledby="testimonials-heading"
      role="region"
    >
      <MaxWidthWrapper>
        <header className="text-center mb-6 md:mb-10">
          <h2
            id="testimonials-heading"
            className="text-2xl md:text-3xl font-bold mb-2 md:mb-3"
          >
            What Students Are Saying
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Join thousands of students who've transformed their study experience
          </p>
        </header>

        {/* Compact Masonry grid */}
        <div
          className="
            columns-1
            sm:columns-2
            md:columns-3
            gap-x-3
            [column-fill:_balance]
          "
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="mb-4 md:mb-5 break-inside-avoid"
              style={{
                transform: `rotate(${getRotation(i)}deg)`,
                transition: "transform 0.3s cubic-bezier(.4,1.2,.4,1)",
                willChange: "transform",
              }}
            >
              <TestimonialCard quote={t.quote} author={t.author} />
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default TestimonialsSection;

// components/landing/CTASection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTheme } from "@/components/providers/theme-provider";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const CTASection = () => {
  const { theme } = useTheme();

  return (
    <section
      className="py-12 md:py-24 relative overflow-hidden"
      aria-label="Call to Action: Transform Your Study Experience"
    >
      <div
        className="absolute inset-0 bg-grid-zinc-700/[0.3] dark:bg-grid-zinc-100/[0.1]"
        aria-hidden="true"
      ></div>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"
        aria-hidden="true"
      ></div>
      <MaxWidthWrapper className="relative z-10">
        <Card className="max-w-3xl mx-auto text-center shadow-lg border-none bg-transparent px-4 md:px-6">
          <CardContent>
            <header>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                Ready to Transform Your Study Experience?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8">
                Join thousands of students who are already using SophistAI to
                master their courses with ease.
              </p>
            </header>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant={theme === "dark" ? "outline" : "default"}
              className="w-full md:w-60 py-4 md:py-6 text-lg md:text-xl"
              aria-label="Get Started"
            >
              Get Started
            </Button>
          </CardFooter>
        </Card>
      </MaxWidthWrapper>
    </section>
  );
};

export default CTASection;

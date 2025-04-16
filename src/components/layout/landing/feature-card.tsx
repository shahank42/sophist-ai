// components/landing/FeatureCard.tsx
import React, { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  rotate = "left",
}: FeatureCardProps & { rotate?: "left" | "right" }) => {
  return (
    <Card
      className={`w-full flex flex-col h-full bg-background border border-border shadow-md hover:shadow-xl transition-all duration-200 ${
        rotate === "left" ? "sm:hover:rotate-[-1deg]" : "sm:hover:rotate-[1deg]"
      } hover:scale-[1.02] sm:hover:scale-105`}
      tabIndex={0}
      aria-label={title}
    >
      <CardHeader className="flex flex-col items-center gap-3 sm:gap-4 pt-6 sm:pt-8 pb-2">
        <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white dark:bg-muted shadow-lg -mt-10 sm:-mt-12 mb-1 sm:mb-2 ring-2 ring-primary/10">
          <span className="text-primary text-2xl sm:text-3xl">{icon}</span>
        </span>
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center px-3 sm:px-4 pb-6 sm:pb-8">
        <CardDescription className="text-muted-foreground text-center text-base sm:text-lg">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

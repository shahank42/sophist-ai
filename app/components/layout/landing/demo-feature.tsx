// components/landing/DemoFeature.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface DemoFeatureProps {
  number: string;
  title: string;
  description: string;
}

const DemoFeature = ({ number, title, description }: DemoFeatureProps) => {
  // Use your useIsMobile hook
  const isMobile = useIsMobile();

  // Animation: less y offset and shorter duration on mobile
  const initial = isMobile ? { opacity: 0, y: 12 } : { opacity: 0, y: 24 };
  const transition = isMobile
    ? { type: "spring", stiffness: 56, damping: 16, mass: 0.75, duration: 0.18 }
    : {
        type: "spring",
        stiffness: 56,
        damping: 16,
        mass: 0.75,
        duration: 0.28,
      };

  return (
    <motion.article
      className="flex items-start"
      aria-label={title}
      initial={initial}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.7 }}
      transition={transition}
    >
      <Badge
        className="mr-5 mt-1 w-11 h-11 flex items-center justify-center text-lg font-bold rounded-full opacity-80 select-none p-0 leading-none"
        variant="outline"
      >
        <span className="flex items-center justify-center w-full h-full">
          {number}
        </span>
      </Badge>
      <Card className="flex-1 shadow-none border-none p-0 bg-transparent">
        <CardContent className="p-0">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.article>
  );
};

export default DemoFeature;

// components/landing/DemoFeature.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DemoFeatureProps {
  number: string;
  title: string;
  description: string;
}

const DemoFeature = ({ number, title, description }: DemoFeatureProps) => {
  return (
    <motion.article
      className="flex items-start"
      aria-label={title}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.7 }}
      transition={{
        type: "spring",
        stiffness: 56,
        damping: 16,
        mass: 0.75,
        duration: 0.28,
      }}
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

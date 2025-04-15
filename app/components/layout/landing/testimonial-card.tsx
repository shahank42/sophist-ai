// components/landing/TestimonialCard.tsx
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function getInitials(name: string) {
  // Get first letter of first and last word
  const words = name.split(" ");
  if (words.length === 1) return words[0][0] || "";
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

const TestimonialCard = ({ quote, author }: TestimonialCardProps) => {
  return (
    <figure>
      <Card className="rounded-lg border bg-background shadow-sm flex flex-col h-full">
        <CardContent className="flex-1 flex flex-col gap-2 pt-4 pb-2 px-3 md:pt-6 md:pb-3 md:px-5">
          {/* <span className="text-muted-foreground mb-1" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block align-top opacity-60"
            >
              <path
                d="M8.1 4.6C8.1 4.26863 7.83137 4 7.5 4H3C2.66863 4 2.4 4.26863 2.4 4.6V10.6C2.4 10.9314 2.66863 11.2 3 11.2H6.4C6.73137 11.2 7 10.9314 7 10.6V7.2H6C5.66863 7.2 5.4 6.93137 5.4 6.6V5.4C5.4 5.06863 5.66863 4.8 6 4.8H7C7.33137 4.8 7.6 5.06863 7.6 5.4V14C7.6 14.3314 7.86863 14.6 8.2 14.6H9.4C9.73137 14.6 10 14.3314 10 14V5.2C10 4.86863 9.73137 4.6 9.4 4.6H8.1Z"
                fill="currentColor"
              />
            </svg>
          </span> */}
          <blockquote className="text-sm md:text-base font-normal leading-relaxed text-foreground">
            {quote}
          </blockquote>
        </CardContent>
        <figcaption>
          <CardFooter className="flex items-center gap-2 pt-2 pb-3 px-3 md:pt-2 md:pb-4 md:px-5">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted flex items-center justify-center text-sm md:text-base font-semibold text-primary shrink-0">
              {getInitials(author)}
            </div>
            <span className="block font-medium text-xs text-foreground truncate">
              {author}
            </span>
          </CardFooter>
        </figcaption>
      </Card>
    </figure>
  );
};

export default TestimonialCard;

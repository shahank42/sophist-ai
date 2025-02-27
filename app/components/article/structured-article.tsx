import React, { useState } from "react";
import { StructuredArticleType } from "@/lib/server/prompts/generateStructuredArticle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { ArticleSection } from "./article-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useElaborateSection } from "@/hooks/use-article-content";
import { Node } from "@xyflow/react";

interface StructuredArticleProps {
  data: StructuredArticleType;
  selectedNode: Node;
  isProcessing?: boolean;
}

export function StructuredArticle({
  data,
  selectedNode,
  isProcessing = false,
}: StructuredArticleProps) {
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(
    null
  );
  const [showCustomPrompt, setShowCustomPrompt] = useState<boolean>(false);

  const handleCustomPromptSubmit = (index: number) => {
    setActiveSectionIndex(index);
    // onRegenerateWithPrompt(index, customPrompt);
    setCustomPrompt("");
    setShowCustomPrompt(false);
  };

  return (
    <article className="prose prose-slate dark:prose-invert prose-headings:font-semibold max-w-none">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-6 scroll-m-20">
        {data.title}
      </h1>
      <p className="leading-7 text-muted-foreground mb-6 text-base">
        {data.introductionParagraph}
      </p>

      {data.sections.map((section, index) => (
        <div
          key={index}
          className={cn(
            "transition-opacity",
            isProcessing && activeSectionIndex === index
              ? "opacity-50"
              : "opacity-100"
          )}
        >
          {isProcessing && activeSectionIndex === index ? (
            <div className="mb-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ) : (
            <ArticleSection
              heading={section.heading}
              selectedNode={selectedNode}
              headingLevel="h2"
              content={section.content}
              sectionIndex={index}
            />
          )}

          {showCustomPrompt && index === activeSectionIndex && (
            <div className="mb-4 flex gap-2">
              <Input
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter custom regeneration prompt..."
                className="flex-grow"
              />
              <Button
                onClick={() => handleCustomPromptSubmit(index)}
                disabled={!customPrompt.trim() || isProcessing}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      ))}
    </article>
  );
}

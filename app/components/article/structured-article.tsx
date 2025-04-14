import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Node } from "@xyflow/react";
import { useStructuredArticle } from "@/hooks/use-article-content";
import { ArticleSection } from "./article-section";

interface StructuredArticleProps {
  content: string;
}

export function StructuredArticle({ content }: StructuredArticleProps) {
  const structuredArticle = useStructuredArticle(content);
  const [selectedSection, setSelectedSection] = useState<number | null>(null);

  if (!structuredArticle) {
    return <></>;
  }

  return (
    <article className="prose prose-slate dark:prose-invert prose-headings:font-semibold max-w-none">
      <h1 className="text-2xl md:text-3xl px-3 font-extrabold tracking-tight text-foreground mb-6 scroll-m-20">
        {structuredArticle.title}
      </h1>
      <p className="leading-7 text-muted-foreground mb-6 text-base">
        {structuredArticle.intro}
      </p>

      {structuredArticle.sections.map((section, index) => (
        <ArticleSection
          key={index}
          index={index}
          section={section}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
        // <div
        //   key={index}
        //   className={cn(
        //     "transition-opacity",
        //     isProcessing && activeSectionIndex === index
        //       ? "opacity-50"
        //       : "opacity-100"
        //   )}
        // >
        //   {isProcessing && activeSectionIndex === index ? (
        //     <div className="mb-8">
        //       <Skeleton className="h-8 w-3/4 mb-4" />
        //       <Skeleton className="h-4 w-full mb-2" />
        //       <Skeleton className="h-4 w-full mb-2" />
        //       <Skeleton className="h-4 w-5/6 mb-2" />
        //       <Skeleton className="h-4 w-full mb-2" />
        //       <Skeleton className="h-4 w-4/5" />
        //     </div>
        //   ) : (
        //     <ArticleSection
        //       heading={section.heading}
        //       selectedNode={selectedNode}
        //       headingLevel="h2"
        //       content={section.content}
        //       sectionIndex={index}
        //     />
        //   )}

        //   {showCustomPrompt && index === activeSectionIndex && (
        //     <div className="mb-4 flex gap-2">
        //       <Input
        //         value={customPrompt}
        //         onChange={(e) => setCustomPrompt(e.target.value)}
        //         placeholder="Enter custom regeneration prompt..."
        //         className="flex-grow"
        //       />
        //       <Button
        //         onClick={() => handleCustomPromptSubmit(index)}
        //         disabled={!customPrompt.trim() || isProcessing}
        //       >
        //         Apply
        //       </Button>
        //     </div>
        //   )}
        // </div>
      ))}
    </article>
  );
}

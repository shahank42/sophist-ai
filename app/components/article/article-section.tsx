import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionContent } from "./section-content";
import { ActionButtons } from "./action-buttons";
import {
  useElaborateSection,
  useRegenerateSection,
} from "@/hooks/use-article-content";
import { Node } from "@xyflow/react";
import { Skeleton } from "../ui/skeleton";

// Section component to handle hover highlighting
export const ArticleSection = ({
  heading,
  headingLevel,
  content,
  sectionIndex,
  selectedNode,
}: {
  heading: string;
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6";
  content: string;
  sectionIndex: number;
  selectedNode: Node;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { mutate: elaborateSection, isPending: isElaborating } =
    useElaborateSection(selectedNode);

  const { mutate: regenerateSection, isPending: isRegenerating } =
    useRegenerateSection(selectedNode);

  // Handler for regenerating a section
  const handleRegenerate = (sectionIndex: number) => {
    if (!selectedNode?.id) return;

    regenerateSection({
      nodeId: selectedNode.id,
      sectionIndex,
    });
  };

  // Handler for regenerating with a custom prompt
  const handleRegenerateWithPrompt = (sectionIndex: number, prompt: string) => {
    if (!selectedNode?.id) return;

    regenerateSection({
      nodeId: selectedNode.id,
      sectionIndex,
      customPrompt: prompt,
    });
  };

  // Handler for elaborating a section
  const handleElaborate = (sectionIndex: number) => {
    if (!selectedNode?.id) return;

    elaborateSection({
      nodeId: selectedNode.id,
      sectionIndex,
    });
  };

  // Handler for popover state changes
  const handlePopoverOpenChange = (isOpen: boolean) => {
    setIsPopoverOpen(isOpen);
  };

  // Section should appear hovered when either mouse is over it OR popover is open
  const shouldShowHovered = isHovered || isPopoverOpen;

  return (
    <Card
      className={cn(
        "my-4 transition-all duration-300 border",
        shouldShowHovered
          ? "border-accent shadow-md"
          : "border-transparent bg-transparent shadow-none",
        shouldShowHovered &&
          "relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-accent before:rounded-l-lg"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle
          className={cn(
            headingLevel === "h2"
              ? "text-2xl"
              : headingLevel === "h3"
                ? "text-xl"
                : headingLevel === "h4"
                  ? "text-lg"
                  : "text-base"
          )}
        >
          {heading}
        </CardTitle>
        <ActionButtons
          isHovered={shouldShowHovered}
          sectionIndex={sectionIndex}
          onRegenerate={handleRegenerate}
          onRegenerateWithPrompt={handleRegenerateWithPrompt}
          onElaborate={handleElaborate}
          isElaborating={isElaborating}
          isRegenerating={isRegenerating}
          onPopoverOpenChange={handlePopoverOpenChange}
        />
      </CardHeader>
      <CardContent className="pb-0">
        {isElaborating || isRegenerating ? (
          <div className="space-y-3 py-2 my-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[96%]" />
            <Skeleton className="h-4 w-[88%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[94%]" />
          </div>
        ) : (
          <SectionContent content={content} />
        )}
      </CardContent>
    </Card>
  );
};

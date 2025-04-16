import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { ContentSegment } from "@/lib/utils/article-parser";
import { MarkdownContent } from "../ui/markdown-content";

// Section component to handle hover highlighting
export const ArticleSection = ({
  section,
  index,
  selectedSection,
  setSelectedSection,
}: {
  section: ContentSegment;
  index: number;
  selectedSection: number | null;
  setSelectedSection: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const queryClient = useQueryClient();
  const { subject } = getRouteApi("/study/$subjectId").useLoaderData();

  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Section should appear hovered when either mouse is over it OR popover is open
  const shouldShowHovered = isHovered || isPopoverOpen;

  const handleTouchStart = () => {
    setSelectedSection(index);
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    // Add a small delay before removing the hover state to make the effect visible
    setTimeout(() => setIsHovered(false), 1000);
    // setSelectedSection(null);
  };

  return (
    <Card
      className={cn(
        "my-4 transition-all duration-300 border flex flex-col",
        selectedSection === index
          ? "border-accent shadow-md"
          : "border-transparent bg-transparent shadow-none",
        selectedSection === index &&
          "relative before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-accent before:rounded-l-lg"
      )}
      onMouseEnter={() => setSelectedSection(index)}
      onMouseLeave={() => setSelectedSection(null)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <CardHeader className="pb-0 px-4 flex flex-row items-center justify-between">
        <CardTitle
          className={cn(
            section.headingLevel === "h2"
              ? "text-3xl"
              : section.headingLevel === "h3"
                ? "text-2xl"
                : section.headingLevel === "h4"
                  ? "text-xl"
                  : "text-lg"
          )}
        >
          {section.heading}
        </CardTitle>
        {/* <ActionButtons
          isHovered={shouldShowHovered}
          sectionIndex={sectionIndex}
          // onRegenerate={handleRegenerate}
          // onRegenerateWithPrompt={handleRegenerateWithPrompt}
          onElaborate={elaborateSectionMutation}
          isElaborating={isElaborating}
          isRegenerating={false}
          onPopoverOpenChange={handlePopoverOpenChange}
        /> */}
      </CardHeader>
      <CardContent className="pb-0 px-4 self-center max-w-fit text-lg">
        {/* {isElaborating || isRegenerating ? ( */}
        {/* {false ? (
          <div className="space-y-3 py-2 my-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[96%]" />
            <Skeleton className="h-4 w-[88%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[94%]" />
          </div>
        ) : ( */}
        {/* <SectionContent content={section.content} /> */}
        <MarkdownContent id="markdown-content-demo" content={section.content} />
        {/* )} */}
      </CardContent>
    </Card>
  );
};

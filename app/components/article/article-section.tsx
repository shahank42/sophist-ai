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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { elaborateSectionFn } from "@/lib/server/rpc/articles";
import { getRouteApi } from "@tanstack/react-router";

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
  const queryClient = useQueryClient();
  const { subject } = getRouteApi("/(app)/app/$subjectId").useLoaderData();

  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { mutate: elaborateSectionMutation, isPending: isElaborating } =
    useMutation({
      // mutationFn: ({
      //   sectionIndex,
      //   selectedNode,
      //   previousContent,
      //   subjectName,
      //   isPro,
      // }: {
      //   sectionIndex: number;
      //   selectedNode: Node;
      //   previousContent: string;
      //   subjectName: string;
      //   isPro: boolean;
      // }) =>
      mutationFn: () =>
        elaborateSectionFn({
          data: {
            nodeId: selectedNode.id,
            sectionIndex,
            title: selectedNode.data.label || "",
            isPro: true,
            contextData: {
              topic: subject.name,
              previousContent: content,
            },
          },
        }),
      onSuccess: (data) => {
        queryClient.setQueryData(["structuredArticle", selectedNode.id], data);
      },
    });

  // // Handler for elaborating a section
  // const handleElaborate = (sectionIndex: number) => {
  //   if (!selectedNode?.id) return;

  //   console.log("just before mut");
  //   elaborateSection({
  //     nodeId: selectedNode.id,
  //     sectionIndex,
  //   });
  //   console.log("just after mut");
  // };

  // const { mutate: regenerateSection, isPending: isRegenerating } =
  //   useRegenerateSection(selectedNode);

  // // Handler for regenerating a section
  // const handleRegenerate = (sectionIndex: number) => {
  //   if (!selectedNode?.id) return;

  //   regenerateSection({
  //     nodeId: selectedNode.id,
  //     sectionIndex,
  //   });
  // };

  // // Handler for regenerating with a custom prompt
  // const handleRegenerateWithPrompt = (sectionIndex: number, prompt: string) => {
  //   if (!selectedNode?.id) return;

  //   regenerateSection({
  //     nodeId: selectedNode.id,
  //     sectionIndex,
  //     customPrompt: prompt,
  //   });
  // };

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
          // onRegenerate={handleRegenerate}
          // onRegenerateWithPrompt={handleRegenerateWithPrompt}
          onElaborate={elaborateSectionMutation}
          isElaborating={isElaborating}
          isRegenerating={false}
          onPopoverOpenChange={handlePopoverOpenChange}
        />
      </CardHeader>
      <CardContent className="pb-0">
        {/* {isElaborating || isRegenerating ? ( */}
        {false ? (
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

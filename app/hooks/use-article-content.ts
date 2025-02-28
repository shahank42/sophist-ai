import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Node } from "@xyflow/react";
import {
  getArticleContentFn,
  getStructuredArticleContentFn,
  regenerateSectionFn,
  elaborateSectionFn,
} from "@/lib/server/rpc/articles";
import { StructuredArticleType } from "@/lib/server/prompts/generateStructuredArticle";
import { User } from "better-auth";
import { getRouteApi } from "@tanstack/react-router";

export function useArticleContent(selectedNode: Node | null) {
  return useQuery({
    queryKey: ["articleContent", selectedNode?.id],
    queryFn: () => {
      if (!selectedNode) return null;

      const data = selectedNode.data || {};

      return getArticleContentFn({
        data: {
          nodeId: selectedNode.id,
          title: selectedNode.data.label || "",
          parentPath: data.parentPath || [],
          topic: data.topic || "",
          syllabus: data.syllabus,
        },
      });
    },
    enabled: !!selectedNode,
  });
}

export function useStructuredArticle(
  selectedNode: Node | null,
  userIsPro: boolean
) {
  const { subject } = getRouteApi("/(app)/app/$subjectId").useLoaderData();

  return useQuery({
    queryKey: ["structuredArticle", selectedNode?.id],
    queryFn: () => {
      if (!selectedNode) return null;

      const data = selectedNode.data || {};

      return getStructuredArticleContentFn({
        data: {
          nodeId: selectedNode.id,
          title: selectedNode.data.label || "",
          isPro: userIsPro,
          contextData: {
            parentPath: data.parentPath || [],
            topic: subject.name || "",
            syllabus: subject.rawSyllabus,
          },
        },
      });
    },
    enabled: !!selectedNode,
  });
}

export function useRegenerateSection(selectedNode: Node) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nodeId,
      sectionIndex,
      customPrompt,
    }: {
      nodeId: string;
      sectionIndex: number;
      customPrompt?: string;
    }) => {
      const data = selectedNode.data || {};

      return regenerateSectionFn({
        data: {
          nodeId,
          sectionIndex,
          customPrompt,
          title: selectedNode.data.label || "",
          parentPath: data.parentPath || [],
          topic: data.topic || "",
          syllabus: data.syllabus,
        },
      });
    },
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(["structuredArticle", variables.nodeId], data);
    },
  });
}

export function useElaborateSection(
  selectedNode: Node,
  previousContent: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nodeId,
      sectionIndex,
    }: {
      nodeId: string;
      sectionIndex: number;
    }) => {
      console.log("mut mid");
      const { subject } = getRouteApi("/(app)/app/$subjectId").useLoaderData();

      const data = selectedNode.data || {};
      console.log(data);

      return elaborateSectionFn({
        data: {
          nodeId: selectedNode.id,
          sectionIndex,
          title: selectedNode.data.label || "",
          isPro: true,
          contextData: {
            topic: subject.name,
            previousContent: previousContent,
          },
        },
      });
    },
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(["structuredArticle", variables.nodeId], data);
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Node } from "@xyflow/react";
import {
  getArticleContentFn,
  getStructuredArticleContentFn,
  regenerateSectionFn,
  elaborateSectionFn,
} from "@/lib/server/rpc/articles";
import { StructuredArticleType } from "@/lib/server/prompts/generateStructuredArticle";

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

export function useStructuredArticle(selectedNode: Node | null) {
  return useQuery({
    queryKey: ["structuredArticle", selectedNode?.id],
    queryFn: () => {
      if (!selectedNode) return null;

      const data = selectedNode.data || {};

      return getStructuredArticleContentFn({
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

export function useElaborateSection(selectedNode: Node) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nodeId,
      sectionIndex,
    }: {
      nodeId: string;
      sectionIndex: number;
    }) => {
      const data = selectedNode.data || {};

      return elaborateSectionFn({
        data: {
          nodeId: selectedNode.id,
          sectionIndex,
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

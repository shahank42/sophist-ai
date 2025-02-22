import { getNodeParentPath } from "@/components/mind-map/utils";
import { getArticleContentFn } from "@/lib/server/rpc/articles";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Node, useReactFlow } from "@xyflow/react";

// export const articleContentQueryOptions = (node: Node) => ()

export const useArticleContent = (
  node: Node | null
  // parentPath: string[]
  // topic: string,
  // syllabus?: string
) => {
  // const { subject } = getRouteApi("/(app)/app/$subjectId").useRouteContext();
  const { subject } = getRouteApi("/(app)/app/$subjectId").useLoaderData();
  // TODO: Get parent path from node
  // const { getNode } = useReactFlow();
  // const parentPath = getNodeParentPath(node.id, getNode, edges).map(
  //   (n) => n.data.label as string
  // );

  return useQuery({
    queryKey: ["article", node?.id],
    queryFn: () => {
      if (!node) return "";
      return getArticleContentFn({
        data: {
          nodeId: node.id,
          title: node.data.label as string,
          parentPath: [],
          topic: subject.name,
          syllabus: subject.rawSyllabus,
        },
      });
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
};

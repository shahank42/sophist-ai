import { getNodeParentPath } from "@/components/mind-map/utils";
import { getArticleContentFn } from "@/lib/server/rpc/articles";
import { Article, parseMarkdownArticle } from "@/lib/utils/article-parser";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";

// export const articleContentQueryOptions = (node: Node) => ()

export const useArticleContent = (
  node: Node | null
  // parentPath: string[]
  // topic: string,
  // syllabus?: string
) => {
  const { subject } = getRouteApi("/study/$subjectId").useLoaderData();
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

export function useStructuredArticle(markdown: string) {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!markdown) {
      setArticle(null);
      return;
    }

    // console.log("raw", markdown);
    const parsedArticle = parseMarkdownArticle(markdown);
    setArticle(parsedArticle);
  }, [markdown]);

  return article;
}

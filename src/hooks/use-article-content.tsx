import { getArticleContentFn } from "@/lib/server/rpc/articles";
import { loadSubjectTreeQueryOptions } from "@/lib/server/rpc/subjects";
import { Article, parseMarkdownArticle } from "@/lib/utils/article-parser";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Node } from "@xyflow/react";
import { useEffect, useState } from "react";

// export const articleContentQueryOptions = (node: Node) => ()

export const useArticleContent = (
  node: Node | null
  // parentPath: string[]
  // topic: string,
  // syllabus?: string
) => {
  const { subjectId } = getRouteApi("/study/$subjectId").useParams();
  const { data: subjectTree } = useSuspenseQuery(
    loadSubjectTreeQueryOptions(subjectId)
  );

  const { subject } = subjectTree;
  // TODO: Get parent path from node
  // const { getNode } = useReactFlow();
  // const parentPath = getNodeParentPath(node.id, getNode, edges).map(
  //   (n) => n.data.label as string
  // );

  return useQuery({
    queryKey: [
      "article",
      node?.id,
      node,
      node?.data.label,
      subject.name,
      subject.rawSyllabus,
    ],
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

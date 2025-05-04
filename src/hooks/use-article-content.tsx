import { getArticleContentFn } from "@/lib/server/rpc/articles";
import { loadSubjectTreeQueryOptions } from "@/lib/server/rpc/subjects";
import { Article, parseMarkdownArticle } from "@/lib/utils/article-parser";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { Node } from "@xyflow/react";
import { useEffect, useState } from "react";

export const articleContentQueryOptions = (node: Node | null, topic: string, syllabus: string) => queryOptions({
  queryKey: [
    "article",
    node?.id,
    // node?.data.label,
    // topic,
    // syllabus,
  ],
  queryFn: () => {
    console.log("topic in usequery", topic)
    if (!node) return "";
    return getArticleContentFn({
      data: {
        nodeId: node.id,
        title: node.data.label as string,
        parentPath: [],
        topic: topic,
        syllabus: syllabus,
      },
    });
    // return "sample article"
  },
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 30,
})

export const useArticleContent = (
  node: Node | null,
  // parentPath: string[]
  topic: string,
  syllabus: string
) => {
  // const { subjectId } = getRouteApi("/study/$subjectId").useParams();
  // const { data: subjectTree } = useSuspenseQuery(
  //   loadSubjectTreeQueryOptions(subjectId)
  // );

  // const { subject } = subjectTree;
  // TODO: Get parent path from node
  // const { getNode } = useReactFlow();
  // const parentPath = getNodeParentPath(node.id, getNode, edges).map(
  //   (n) => n.data.label as string
  // );

  console.log("topic in usearticle", topic)


  return useQuery(articleContentQueryOptions(node, topic, syllabus));
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

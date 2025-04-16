import { createServerFn } from "@tanstack/react-start";
import { symbol, z } from "zod";
import { getArticleByNode, insertArticle } from "../queries/articles";
import { generateArticle } from "../prompts/generateArticle";

export const getArticleContentFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        nodeId: z.string(),
        title: z.string(),
        parentPath: z.array(z.string()),
        topic: z.string(),
        syllabus: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data: { nodeId, title, parentPath, topic, syllabus } }) => {
    const existingArticle = await getArticleByNode(nodeId);
    if (existingArticle) {
      console.log("Article fetched!");
      return existingArticle.content;
    }

    const generatedArticle = await generateArticle(
      title,
      parentPath,
      topic,
      syllabus
    );

    const insertedArticle = await insertArticle(
      nodeId,
      generatedArticle.content as string
    );
    // if (articleInsertError) throw articleInsertError;
    return insertedArticle.content;
  });

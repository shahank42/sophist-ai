import { eq } from "drizzle-orm";
import { db } from "../db";
import { articles, nodes } from "../db/schema";

export const getArticleByNode = async (nodeId: string) => {
  const data = await db
    .select()
    .from(articles)
    .where(eq(articles.nodeId, nodeId));

  return data[0];
};

export const insertArticle = async (nodeId: string, content: string) => {
  // First check if the node exists
  const nodeExists = await db.select().from(nodes).where(eq(nodes.id, nodeId));

  if (nodeExists.length === 0) {
    throw new Error(`Node with id ${nodeId} does not exist`);
  }

  const data = await db
    .insert(articles)
    .values({
      nodeId,
      content,
    })
    .returning();

  return data[0];
};

import { eq } from "drizzle-orm";
import { db } from "../db";
import { articles, nodes } from "../db/schema";
import { StructuredArticleType } from "../prompts/generateStructuredArticle";

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

// New function to insert structured article
export const insertStructuredArticle = async (
  nodeId: string,
  structuredContent: StructuredArticleType
) => {
  // Check if the node exists
  const nodeExists = await db.select().from(nodes).where(eq(nodes.id, nodeId));

  if (nodeExists.length === 0) {
    throw new Error(`Node with id ${nodeId} does not exist`);
  }

  // Plain text version for backward compatibility
  const plainTextContent =
    structuredContent.title +
    "\n\n" +
    structuredContent.sections
      .map((section) => section.heading + "\n" + section.content)
      .join("\n\n");

  const data = await db
    .insert(articles)
    .values({
      nodeId,
      content: plainTextContent,
      structuredContent: JSON.stringify(structuredContent) as any,
    })
    .returning();

  return data[0];
};

// Get structured article by node ID
export const getStructuredArticleByNode = async (nodeId: string) => {
  const data = await db
    .select()
    .from(articles)
    .where(eq(articles.nodeId, nodeId));

  return data[0]?.structuredContent as StructuredArticleType | undefined;
};

// Update a specific section in a structured article
export const updateStructuredArticleSection = async (
  nodeId: string,
  sectionIndex: number,
  newContent: string
) => {
  // First get the existing article
  const article = await getArticleByNode(nodeId);

  if (!article) {
    throw new Error(`Article for node ${nodeId} does not exist`);
  }

  const structuredContent = article.structuredContent as
    | StructuredArticleType
    | undefined;

  if (!structuredContent) {
    throw new Error(
      `Structured content for article ${article.id} does not exist`
    );
  }

  // Update the specific section
  const updatedContent = {
    ...structuredContent,
    sections: structuredContent.sections.map((section, idx) =>
      idx === sectionIndex ? { ...section, content: newContent } : section
    ),
  };

  // Update the article
  const updatedArticle = await db
    .update(articles)
    .set({
      structuredContent: updatedContent as any,
      updatedAt: new Date(),
    })
    .where(eq(articles.nodeId, nodeId))
    .returning();

  return updatedArticle[0];
};

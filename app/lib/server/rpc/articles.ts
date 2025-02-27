import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import {
  getArticleByNode,
  insertArticle,
  getStructuredArticleByNode,
  insertStructuredArticle,
  updateStructuredArticleSection,
} from "../queries/articles";
import { generateArticle } from "../prompts/generateArticle";
import {
  generateStructuredArticle,
  StructuredArticleType,
} from "../prompts/generateStructuredArticle";
import { elaborateArticleSection } from "../prompts/elaborateArticleSection";
import { regenerateArticleSectionWithCustomPrompt } from "../prompts/regenerateArticleSectionWithCustomPrompt";
import { regenerateArticleSection } from "../prompts/regenerateArticleSection";

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

export const getStructuredArticleContentFn = createServerFn({ method: "POST" })
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
    // First check if we already have a structured article for this node
    const existingStructuredArticle = await getStructuredArticleByNode(nodeId);
    if (existingStructuredArticle) {
      console.log("Structured article fetched from DB!");
      return existingStructuredArticle;
    }

    // Generate a new structured article
    const generatedArticle = await generateStructuredArticle(
      title,
      parentPath,
      topic,
      syllabus
    );

    // Store the structured article in the database
    await insertStructuredArticle(nodeId, generatedArticle);

    return generatedArticle;
  });

// New function to regenerate a specific section
export const regenerateSectionFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        nodeId: z.string(),
        sectionIndex: z.number(),
        customPrompt: z.string().optional(),
        title: z.string(),
        parentPath: z.array(z.string()),
        topic: z.string(),
        syllabus: z.string().optional(),
      })
      .parse(data)
  )
  .handler(
    async ({
      data: {
        nodeId,
        sectionIndex,
        customPrompt,
        title,
        parentPath,
        topic,
        syllabus,
      },
    }) => {
      // Get the existing article
      const existingArticle = await getArticleByNode(nodeId);
      if (!existingArticle || !existingArticle.structuredContent) {
        throw new Error(`Structured article for node ${nodeId} not found`);
      }

      const structuredContent =
        existingArticle.structuredContent as StructuredArticleType;
      const section = structuredContent.sections[sectionIndex];

      if (!section) {
        throw new Error(`Section ${sectionIndex} not found in article`);
      }

      // In a real implementation, you would use an LLM to regenerate the content
      // based on the section heading, article title, and optional custom prompt
      let newContent = `Regenerated content for section "${section.heading}"`;

      if (customPrompt) {
        const elaboratedContent =
          await regenerateArticleSectionWithCustomPrompt(
            title,
            parentPath,
            topic,
            section.content,
            customPrompt,
            syllabus
          );

        newContent = elaboratedContent.content as string;
      } else {
        const elaboratedContent = await regenerateArticleSection(
          title,
          parentPath,
          topic,
          section.content,
          syllabus
        );

        newContent = elaboratedContent.content as string;
      }

      // Update the section in the database
      const updatedArticle = await updateStructuredArticleSection(
        nodeId,
        sectionIndex,
        newContent
      );

      return updatedArticle.structuredContent as StructuredArticleType;
    }
  );

// New function to elaborate on a specific section
export const elaborateSectionFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        nodeId: z.string(),
        sectionIndex: z.number(),
        title: z.string(),
        parentPath: z.array(z.string()),
        topic: z.string(),
        syllabus: z.string().optional(),
      })
      .parse(data)
  )
  .handler(
    async ({
      data: { nodeId, sectionIndex, title, parentPath, topic, syllabus },
    }) => {
      // Get the existing article
      const existingArticle = await getStructuredArticleByNode(nodeId);
      if (!existingArticle) {
        console.error(`Structured article for node ${nodeId} not found`);
      }

      const structuredContent = existingArticle as StructuredArticleType;
      const section = structuredContent.sections[sectionIndex];

      if (!section) {
        throw new Error(`Section ${sectionIndex} not found in article`);
      }
      console.log("elaborating", section);

      // In a real implementation, you would use an LLM to elaborate the content
      // const elaboratedContent = `${section.content}\n\nElaboration: This section has been expanded with more details, examples, and explanations to provide a more comprehensive understanding of the topic.`;

      const elaboratedContent = await elaborateArticleSection(
        title,
        parentPath,
        topic,
        syllabus
      );

      // Update the section in the database
      const updatedArticle = await updateStructuredArticleSection(
        nodeId,
        sectionIndex,
        elaboratedContent.content as string
      );

      return updatedArticle.structuredContent as StructuredArticleType;
    }
  );

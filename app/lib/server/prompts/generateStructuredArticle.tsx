// import { useQuery } from "@tanstack/react-query";
// import { model } from "../langchain";

import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  GROQ_API_KEY,
} from "@/lib/langchain";
import { ChatGroq } from "@langchain/groq";
import { CloudflareWorkersAI } from "@langchain/cloudflare";
import { z } from "zod";
import { CONFIG } from "@/lib/config";

const structuredArticleSchema = z.object({
  title: z.string().describe("The title of the article."),
  introductionParagraph: z
    .string()
    .describe("The introduction paragraph of the article."),
  sections: z.array(
    z.object({
      heading: z
        .string()
        .describe(
          "The heading of the section. Be absolutely sure to not include headings like Introduction, Conclusion or the actual title of the article itself."
        ),
      headingLevel: z
        .enum(["h2", "h3", "h4", "h5", "h6"])
        .describe("The heading level of the section."),
      content: z
        .string()
        .describe(
          "The content of the section in Markdown. Should be very detailed and informative. Only include the content, that is paragraphs, lists, tables, etc. but absolutely no headings."
        ),
    })
  ),
});

export type StructuredArticleType = z.infer<typeof structuredArticleSchema>;

export async function generateStructuredArticle(
  title: string,
  isPro: boolean,
  contextData: {
    parentPath: string[];
    topic: string;
    syllabus?: string;
  }
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: isPro
      ? CONFIG.models.pro.generateStructuredArticle
      : CONFIG.models.free.generateStructuredArticle,
  });

  const structuredModel = model.withStructuredOutput(structuredArticleSchema);

  return structuredModel.invoke(`
<SYSTEM_CONTEXT>
You are Richard Feynman, world renowned Physicist and masterful educator. You are known for your exceptional abilities of breaking down topics into simple, digestible explanations. That's why you even coined the term "Feynman Technique" to describe your approach to learning and teaching complex subjects.
</SYSTEM_CONTEXT>

<TASK>
Your task is to use your expertise of simplifying complex topics to generate a detailed article based on the following syllabus. The article should focus on the specified title and draw context from the syllabus to determine which topics to elaborate on. Please ensure that the article is concise and to the point, avoiding unnecessary introductions, conclusions, or explanations of other headings. Use Markdown for formatting, and include tables and LaTeX equations generously.

You have to make sure the reader is able to comprehend what you're explaining. So that's why you should make use of lists, tables, and other formatting options to make the content more digestible.
</TASK>

<ARTICLE_TITLE>${title}</ARTICLE_TITLE>

<CONTEXT>
  <TOPIC 
    meaning="The subject of which the article you need to generate is a part of."
  >
    ${contextData.topic}
  </TOPIC>

  <SYLLABUS 
    meaning="The syllabus of TOPIC, of which the article you need to generate is a part of."
  >
    ${contextData.syllabus}
  </SYLLABUS>

  <PARENT_PATH 
    meaning="All the headings and subheading leading to this article's TITLE"
  >
    ${contextData.parentPath.join(" > ")}
  </PARENT_PATH>
</CONTEXT>
   `);
}

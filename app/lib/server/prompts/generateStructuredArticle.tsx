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
  parentPath: string[],
  topic: string,
  syllabus?: string
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "mistral-saba-24b",
  });

  const structuredModel = model.withStructuredOutput(structuredArticleSchema);

  return structuredModel.invoke(`
You are an advanced language model tasked with generating a detailed article based on the following syllabus. The article should focus on the specified title and draw context from the syllabus to determine which topics to elaborate on. Please ensure that the article is concise and to the point, avoiding unnecessary introductions, conclusions, or explanations of other headings. Use Markdown for formatting, and include tables and LaTeX equations where relevant.

The goal of the article is to incluclate a sense of understanding for the reader. It should be as easy to understand as possible, while still being informative and educational.

Syllabus:

<syllabus-begin>
${syllabus}
</syllabus-end>

Here I am also providing you with a parent path, which is an array of headings from root to current which you can use to gain a better understanding of the context.

Parent Path: ${parentPath}

Article Title: ${title}

Instructions:

  - Generate the article based on the syllabus context. Use the provided syllabus to get an understanding of what to include in the article.
  - Use Markdown for formatting.
  - Include tables where necessary. Don't unnecessarily add them everywhwere.
  - Use LaTeX for any mathematical equations. (you don't need to specifically say that it's a LaTeX equation, just include it in the text).
  - Focus on the relevant topics from the syllabus without unnecessary content.
  - If the topic is instructional, then make sure to include suitable steps, examples and walkthroughs. 
   `);
}

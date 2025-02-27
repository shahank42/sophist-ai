import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  GROQ_API_KEY,
} from "@/lib/langchain";
import { ChatGroq } from "@langchain/groq";
import { CloudflareWorkersAI } from "@langchain/cloudflare";

export async function regenerateArticleSectionWithCustomPrompt(
  title: string,
  parentPath: string[],
  topic: string,
  prevContent: string,
  prompt: string,
  syllabus?: string
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "mistral-saba-24b",
  });

  return model.invoke(`
You are an advanced language model tasked with generating or updating a specific section of an article based on the following syllabus. Focus ONLY on the specified section title and draw context from the syllabus to determine what to include. Do not generate content for the entire article - only the requested section.

The current content for the section is as follows:
${prevContent}

The goal is to recreate the section based on the following custom instructions: ${prompt}. It should be as accessible as possible while still being informative and educational - prioritize clarity over complexity.

Syllabus:

<syllabus-begin>
${syllabus}
</syllabus-end>

Here I am providing you with the parent path, which is an array of headings from root to current section. Use this to understand where this section fits in the hierarchy of the article.

Parent Path: ${parentPath}

Section Title to Update: ${title}

Instructions:

  - Generate ONLY the content for the specified section title, not the entire article.
  - Ensure the section aligns with the parent headings and overall article structure.
  - Start with a brief conceptual overview of this specific section's topic.
  - Use clear, simple language and break down complex ideas into digestible parts.
  - Include relevant examples, analogies, or mental models specific to this section.
  - Match the tone and style that would be consistent with the rest of the article.
  - Use Markdown for formatting with appropriate subheaders (H3, H4) if needed.
  - Include tables only when they enhance understanding of comparative or structured information.
  - Use LaTeX for mathematical equations, ensuring they are explained in plain language as well.
  - If the section is instructional, provide step-by-step guidance with practical examples.
  - When appropriate, note common misconceptions or areas where students typically struggle.
  - Keep the section focused and concise - don't repeat content that would belong in other sections.
  - Do not add any prefacing text like "Section:" or "Here is the content for..." - just produce the section content directly.
   `);
}

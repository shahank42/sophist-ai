import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  GROQ_API_KEY,
} from "@/lib/langchain";
import { ChatGroq } from "@langchain/groq";
import { CloudflareWorkersAI } from "@langchain/cloudflare";
import { CONFIG } from "@/lib/config";

export async function elaborateArticleSection(
  heading: string,
  isPro: boolean,
  contextData: {
    topic: string;
    previousContent: string;
  }
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: isPro
      ? CONFIG.models.pro.elaborateArticleSection
      : CONFIG.models.free.elaborateArticleSection,
  });

  return model.invoke(`
<SYSTEM_CONTEXT>
You are Richard Feynman, world renowned Physicist and masterful educator. You are known for your exceptional abilities of breaking down topics into simple, digestible explanations. That's why you even coined the term "Feynman Technique" to describe your approach to learning and teaching complex subjects.
</SYSTEM_CONTEXT>

<TASK>
Your task is to use your expertise of simplifying complex topics to expand and elaborate on the given article. The content you generate should focus on the specified heading and elaborate upon the already existing content. Please ensure that the article is concise and to the point, avoiding unnecessary introductions, conclusions, or explanations of other headings. Use Markdown for formatting, and include tables and LaTeX equations more generously.

You have to make sure the reader is able to comprehend what you're explaining. So that's why you should make use of lists, tables, and other formatting options to make the content more digestible.

There is no need to elaborate too much now, just a 20-25% increase in content should be enough.
</TASK>

<ARTICLE_HEADING>${heading}</ARTICLE_HEADING>

<CONTEXT>
  <TOPIC 
    meaning="The subject of which the article you need to generate is a part of."
  >
    ${contextData.topic}
  </TOPIC>

  <PREVIOUS_CONTENT 
    meaning="The existing content of the article before your elaboration."
  >
    ${contextData.previousContent}
  </PREVIOUS_CONTENT>
</CONTEXT>
   `);
}

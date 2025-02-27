// import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import {
  CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_API_TOKEN,
  GROQ_API_KEY,
} from "@/lib/langchain";
import { CloudflareWorkersAI } from "@langchain/cloudflare";

export const initialStructureSchema = z.object({
  id: z.string().describe("The unique identifier for the node."),
  title: z.string().describe("The title of the node."),
  children: z.array(z.any()).describe("The children of the node."),
});

export type InitialStructure = z.infer<typeof initialStructureSchema>;

export async function fetchInitialStructure(
  topic: string,
  syllabus?: string
): Promise<InitialStructure> {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "mistral-saba-24b",
  });

  // const model = new CloudflareWorkersAI({
  //   model: "@cf/meta/llama-3.1-70b-instruct",
  //   cloudflareAccountId: CLOUDFLARE_ACCOUNT_ID,
  //   cloudflareApiToken: CLOUDFLARE_API_TOKEN,
  // });

  const structuredModel = model.withStructuredOutput(initialStructureSchema);

  const res = await structuredModel.invoke(`
I'm giving you a syllabus for the subject: ${topic}

i want you to parse this syllabus and give me a detailed study plan of all the topics i need to study to completely and thoroughly cover the syllabus.

Output Format:
Provide the study plain structure in JSON format, adhering to the following schema:

interface HeadingNode {
  id: string;
  title: string;
  children: HeadingNode[]; 
}

<syllabus-begin>
${syllabus}
</syllabus-end>
    `);

  console.log(res);

  return res;
}

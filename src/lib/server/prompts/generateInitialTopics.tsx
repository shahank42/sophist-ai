// import { useQuery } from "@tanstack/react-query";
import { GROQ_API_KEY } from "@/lib/langchain";
import { ChatGroq } from "@langchain/groq";
import { z } from "zod";

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
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
  });

  // const model = new CloudflareWorkersAI({
  //   model: "@cf/meta/llama-3.1-70b-instruct",
  //   cloudflareAccountId: CLOUDFLARE_ACCOUNT_ID,
  //   cloudflareApiToken: CLOUDFLARE_API_TOKEN,
  // });

  const structuredModel = model.withStructuredOutput(initialStructureSchema);

  const res = await structuredModel.invoke(`
I need you to analyze this ${topic} syllabus and construct a comprehensive, hierarchical study structure. Employ deep reasoning to identify:

1) Core topics and their logical relationships
2) Supporting subtopics that build conceptual understanding
3) Natural learning progressions and dependencies between topics

Apply pedagogical principles to structure the knowledge optimally:
- Group related concepts that build upon each other
- Identify foundational topics that should be mastered early
- Recognize advanced topics that require prerequisite knowledge
- Maintain proper scope (neither too granular nor too broad)

As you reason through the syllabus, note:
- Explicit topics mentioned directly
- Implicit topics necessary for understanding but not explicitly stated
- The appropriate depth for each branch of knowledge

<syllabus-begin>
${syllabus}
</syllabus-end>

Output the study plan as a JSON tree structure following this schema:
interface HeadingNode {
  id: string;           // Unique identifier for each node
  title: string;        // Clear, concise topic title
  children: HeadingNode[]; // Subtopics (empty array if none)
}

Before finalizing your response, verify that:
- Your structure covers ALL material in the syllabus
- Topics follow a logical learning progression
- The hierarchy has appropriate depth (typically 3-5 levels)
- Node relationships accurately reflect knowledge dependencies
    `)

  console.log(res);

  return res;
}

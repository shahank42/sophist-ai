// import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { GROQ_API_KEY } from "@/lib/langchain";

export const childrenStructureSchema = z.object({
  children: z.array(
    z.object({
      id: z.string().describe("The unique identifier for the node."),
      title: z.string().describe("The title of the node."),
    })
  ),
});

export type ChildrenStructure = z.infer<typeof childrenStructureSchema>;

export async function generateChildren(
  title: string,
  topic: string,
  content: string,
  syllabus?: string
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
  });

  const structuredModel = model.withStructuredOutput(childrenStructureSchema);

  return structuredModel.invoke(`
You are an expert curriculum designer and knowledge architect with a vast understanding of various subjects. Your task is to create a comprehensive, well-structured study plan based off some content.

The title of the article is: ${title}

Here is the content from which you need to extract the main headings and gain a context of the topics you need to generate:

<begin-content>
${content}
</end-content>

Objective:
Use the first-level headings from the above provided content to create a list of subheadings for the given article.

Guidelines:
1. Analyze the given title and content carefully. 
2. Create a logical, comprehensive breakdown of the subject into main topics and specific areas of study.
3. Ensure that the headings are clear, concise, and informative.
4. Frame each heading to spark curiosity and encourage further exploration.

Output Format:
Provide the study plan structure in JSON format, adhering to the following schema:

{
  children: {
    id: string;
    title: string;
  }[]
}

which is basically an arrayof objects with id and title.
    `);
}

// export function useCurriculum(topic: string) {
//   return useQuery({
//     queryKey: ["curriculum", topic],
//     queryFn: () => fetchCurriculum(topic),
//     staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
//     cacheTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
//     retry: 2,
//     enabled: Boolean(topic),
//   });
// }

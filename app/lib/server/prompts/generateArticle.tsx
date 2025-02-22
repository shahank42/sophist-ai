// import { useQuery } from "@tanstack/react-query";
// import { model } from "../langchain";

import { GROQ_API_KEY } from "@/lib/langchain";
import { ChatGroq } from "@langchain/groq";

export async function generateArticle(
  title: string,
  parentPath: string[],
  topic: string,
  syllabus?: string
) {
  const model = new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
  });

  console.log(parentPath);

  //   return model.stream(`
  // You are an expert researcher and writer tasked with creating a comprehensive, study-oriented article on based on a given syllabus or topic. Your goal is to produce a detailed, well-structured piece that serves as an authoritative resource for students and researchers.

  // The subject is ${topic}.

  // Article Title: ${title}

  // Please create a thorough article pertaining to the subject ${topic} that is well-structured, informative, and engaging. The article should be written in a clear, concise manner with a focus on accurate information.

  // Guidelines:

  // 1. Structure: Organize the content using the parent headings provided below.

  // 2. Content:
  //    - Provide comprehensive coverage of each heading.
  //    - The context of the content can be derived from the syllabus provided to you.
  //    - Try to stick to the headings given in the syllabus. If you need to go deeper, create your own sub-headings as if they would appear in the syllabus.
  //    - Include relevant facts, explanations, examples, and context.
  //    - Use clear, concise language suitable for studying.
  //    - Do not hesitate to go into detail.
  //    - Remember, a student will be styding this for their test, so make sure to provide enough information to prepare them for the exam.
  //    - Ignore any unnecessary information.
  //    - Ignore headings like Introduction, Conclusion, etc. as they are not needed.
  //    - Add markdown charts, latex, mermaid diagrams or any other visual representation if needed.

  // 3. Length and Detail:
  //    - Aim for a thorough exploration of the subject.
  //    - Do not hesitate to write extensively; longer, more detailed content is preferred.

  // 4. Formatting:
  //    - Use Markdown for text formatting.
  //    - The main article heading will be in h1. The other headings will follow as per the hierarchy.
  //    - (Important) DO NOT include any unnecessary spacings, dashes or lines. Also no long lines of "===" and so. Just output plain markdown.

  // 5. Accessibility:
  //    - While maintaining academic rigor, ensure the writing is easy to follow.
  //    - Define technical terms when first introduced.
  //    - Use transitions to connect ideas and sections.
  //     `);

  return model.invoke(`
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

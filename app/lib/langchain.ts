import { ChatGroq } from "@langchain/groq";

export const GROQ_API_KEY = process.env.GROQ_API_KEY!;

export const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY!,
  model: "llama-3.3-70b-versatile",
});

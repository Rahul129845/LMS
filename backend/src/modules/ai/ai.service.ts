import { HfInference } from "@huggingface/inference";
import { env } from "../../config/env";

// Create instance — if no token is provided, requests will fail gracefully
let hf: HfInference | null = null;
if (env.HF_API_TOKEN) {
  hf = new HfInference(env.HF_API_TOKEN);
}

export async function summarizeText(text: string): Promise<string> {
  if (!hf) throw new Error("AI not configured (Missing HF_API_TOKEN)");
  
  const result = await hf.summarization({
    model: "facebook/bart-large-cnn",
    inputs: text,
    parameters: {
      max_length: 200,
      min_length: 50,
    },
  });
  return result.summary_text;
}

export async function answerQuestion(question: string, context: string): Promise<string> {
  if (!hf) throw new Error("AI not configured (Missing HF_API_TOKEN)");

  const result = await hf.questionAnswering({
    model: "deepset/roberta-base-squad2",
    inputs: { question, context },
  });
  return result.answer;
}

export async function generateQuiz(topic: string, context: string): Promise<string> {
  if (!hf) throw new Error("AI not configured (Missing HF_API_TOKEN)");

  const prompt = `Based on the following context about "${topic}", generate 3 multiple-choice quiz questions. Format as JSON array with "question", "options" (array of 4 strings), and "answer" (correct string).\n\nContext: ${context}`;
  
  const result = await hf.textGeneration({
    model: "google/flan-t5-base",
    inputs: prompt,
    parameters: { max_new_tokens: 300, temperature: 0.7 },
  });
  return result.generated_text;
}

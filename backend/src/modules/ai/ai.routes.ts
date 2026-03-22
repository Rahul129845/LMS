import { Router, Request, Response, NextFunction } from "express";
import { summarizeText, answerQuestion, generateQuiz } from "./ai.service";
import { authMiddleware } from "../../middleware/authMiddleware";

export const aiRoutes = Router();

// POST /api/ai/summarize
aiRoutes.post("/summarize", authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400).json({ error: "text is required" });
      return;
    }
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (error: any) {
    if (error.message.includes("AI not configured")) {
       res.status(503).json({ error: error.message });
       return;
    }
    next(error);
  }
});

// POST /api/ai/ask
aiRoutes.post("/ask", authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { question, context } = req.body;
    if (!question || !context) {
      res.status(400).json({ error: "question and context are required" });
      return;
    }
    const answer = await answerQuestion(question, context);
    res.json({ answer });
  } catch (error: any) {
    if (error.message.includes("AI not configured")) {
       res.status(503).json({ error: error.message });
       return;
    }
    next(error);
  }
});

// POST /api/ai/quiz
aiRoutes.post("/quiz", authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic, context } = req.body;
    if (!topic || !context) {
      res.status(400).json({ error: "topic and context are required" });
      return;
    }
    const quiz = await generateQuiz(topic, context);
    res.json({ quiz });
  } catch (error: any) {
    if (error.message.includes("AI not configured")) {
       res.status(503).json({ error: error.message });
       return;
    }
    next(error);
  }
});

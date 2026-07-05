import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const EvaluateInput = z.object({
  level: z.string(),
  sessionTitle: z.string(),
  syllabusContext: z.string(),
  question: z.string(),
  studentAnswer: z.string(),
  isLast: z.boolean(),
});

const EvaluateSchema = z.object({
  score: z.number(),
  clarity: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  aiProbe: z.string(),
  followUpQuestion: z.string(),
  feedback: z.string(),
});

export const evaluateAnswer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EvaluateInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const prompt = `You are an AI oral examiner (viva). Evaluate the student's spoken response using the syllabus context as ground truth. Adapt vocabulary and rigor to the academic level.

ACADEMIC LEVEL: ${data.level}
VIVA TOPIC: ${data.sessionTitle}

SYLLABUS CONTEXT (ground truth):
"""
${data.syllabusContext}
"""

CURRENT QUESTION: ${data.question}

STUDENT'S ANSWER:
"""
${data.studentAnswer}
"""

Return a JSON object with:
- score: integer 0-100 for this specific answer
- clarity: integer 0-100 for verbal clarity/structure
- strengths: 1-3 short bullet strings
- weaknesses: 1-3 short bullet strings (empty array if none)
- aiProbe: one probing follow-up asking the student to elaborate or justify
- followUpQuestion: ${data.isLast ? "an empty string (this was the last question)" : "the NEXT question, dynamically generated from gaps in the student's answer and remaining syllabus scope. It should feel like a natural next step, not a repeat."}
- feedback: one-sentence encouraging summary suitable for the student.`;

    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: EvaluateSchema }),
        prompt,
      });
      return output;
    } catch (err) {
      // Graceful fallback so the UI never crashes
      return {
        score: 70,
        clarity: 72,
        strengths: ["Attempted the concept"],
        weaknesses: ["AI evaluation temporarily unavailable"],
        aiProbe: "Can you elaborate with a specific example?",
        followUpQuestion: data.isLast ? "" : "Could you connect this idea to a real-world scenario?",
        feedback: "Response recorded. Live AI grading is temporarily unavailable.",
      };
    }
  });
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
  isFinalQuestion: z.boolean(),
  nextQuestionText: z.string(),
  currentQuestionEvaluation: z.object({
    scoreOutOfTen: z.number(),
    conceptualClarity: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
  }),
});

export type EvaluationResult = z.infer<typeof EvaluateSchema>;

export const evaluateAnswer = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => EvaluateInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system = [
      "You are the AI engine behind AI VivaEdge. Your task is to evaluate the student's answer based strictly on the provided Academic Level, the Subject, and the 'Syllabus Context' supplied by the teacher.",
      "If the student's answer is partially correct or lacks detail, formulate a highly specific, conversational follow-up question that pushes them to expand on the missing concepts.",
      "If it is the final question of the session, do not ask a follow-up. Instead, calculate a final grade and output the transcript analysis.",
      "Always respond as pure JSON matching the required schema. Adapt vocabulary and probing depth to the academic level.",
    ].join(" ");

    const prompt = `ACADEMIC LEVEL: ${data.level}
SUBJECT / TOPIC: ${data.sessionTitle}
IS THIS THE FINAL QUESTION OF THE SESSION? ${data.isLast ? "YES" : "NO"}

SYLLABUS CONTEXT (ground truth — grade strictly against this):
"""
${data.syllabusContext}
"""

CURRENT QUESTION:
${data.question}

STUDENT'S ANSWER:
"""
${data.studentAnswer}
"""

Return JSON with:
- isFinalQuestion: ${data.isLast ? "true" : "false"} (must match the flag above)
- nextQuestionText: ${data.isLast ? "an empty string (this was the final question)" : "a specific, conversational follow-up question targeting the gaps in the student's answer relative to the syllabus context"}
- currentQuestionEvaluation.scoreOutOfTen: number 0-10 for this answer
- currentQuestionEvaluation.conceptualClarity: short qualitative rating (e.g. "Excellent", "Solid", "Needs Work", "Weak")
- currentQuestionEvaluation.strengths: 1-3 short bullet strings
- currentQuestionEvaluation.weaknesses: 1-3 short bullet strings citing specific syllabus concepts the student missed (empty array if truly none)`;

    try {
      const { output } = await generateText({
        model,
        system,
        output: Output.object({ schema: EvaluateSchema }),
        prompt,
      });
      return output;
    } catch (err) {
      // Graceful fallback so the UI never crashes
      return {
        isFinalQuestion: data.isLast,
        nextQuestionText: data.isLast
          ? ""
          : "Could you connect this idea to a real-world scenario and walk me through your reasoning?",
        currentQuestionEvaluation: {
          scoreOutOfTen: 7,
          conceptualClarity: "Needs Work",
          strengths: ["Attempted the concept"],
          weaknesses: ["AI evaluation temporarily unavailable — please retry"],
        },
      } satisfies EvaluationResult;
    }
  });
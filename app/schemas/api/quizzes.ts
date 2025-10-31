import { z } from "zod";

// POST

const optionSchema = z.object({
  text: z.string().min(1, "Option text can't be blank"),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1, "Question text can't be blank"),
  options: z
    .array(optionSchema)
    .min(1, "Each question needs at least 1 option"),
});

export const quizSchema = z.object({
  title: z.string().min(1, "Title can't be blank"),
  questions: z.array(questionSchema).min(1, "Quiz needs at least 1 question"),
});

// GET

export const paramsSchema = z.object({
  quizId: z.string("quizId is not valid").length(8),
});

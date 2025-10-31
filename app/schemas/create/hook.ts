import { z } from "zod";

const optionSchema = z.object({
  text: z.string().min(1, "Option cannot be empty"),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  text: z.string().min(1, "Question cannot be empty"),
  options: z
    .array(optionSchema)
    .min(2, "Question must have at least 2 options")
    .refine((opts) => opts.some((o) => o.isCorrect), {
      message: "Question must have a correct answer",
    }),
});

export const quizSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  questions: z.array(questionSchema).min(1, "Add at least one question"),
});

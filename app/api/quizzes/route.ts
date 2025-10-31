import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { quizSchema } from "@/app/schemas/api/quizzes";
import z from "zod";
import { rateLimitResponse } from "@/app/lib/rateLimit/createQuiz";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  const limited = rateLimitResponse(ip);
  if (limited) return limited;

  try {
    const data = await req.json().catch(() => {
      throw new Error("INVALID_JSON");
    });

    const parsed = quizSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_BODY",
            message: "The request body contains invalid data.",
            details: z.treeifyError(parsed.error),
          },
        },
        { status: 400 },
      );
    }

    try {
      const quiz = await prisma.quiz.create({
        data: {
          title: parsed.data.title,
          questions: {
            create: parsed.data.questions.map((q, index) => ({
              text: q.text,
              order: index,
              options: {
                create: q.options.map((o) => ({
                  text: o.text,
                  isCorrect: o.isCorrect,
                })),
              },
            })),
          },
        },
        include: {
          questions: { include: { options: true } },
        },
      });

      return NextResponse.json(quiz, { status: 201 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Prisma error:", err);

      return NextResponse.json(
        {
          error: {
            code: "DATABASE_ERROR",
            message:
              "An internal error occurred while saving the quiz. Please try again later.",
          },
        },
        { status: 500 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("❌ Request error:", err);

    if (err.message === "INVALID_JSON") {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "The request body is not a valid JSON.",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "UNEXPECTED_ERROR",
          message:
            "An unexpected error occurred while processing the request. Please try again later.",
        },
      },
      { status: 500 },
    );
  }
}

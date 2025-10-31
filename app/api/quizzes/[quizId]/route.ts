import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { paramsSchema } from "@/app/schemas/api/quizzes";
import z from "zod";
import { getCacheById, setCache } from "@/app/lib/cache/viewQuiz";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  try {
    const { quizId } = await params;
    const parsed = paramsSchema.safeParse({ quizId });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PARAMS",
            message: "The request parameters are invalid.",
            details: z.treeifyError(parsed.error),
          },
        },
        { status: 400 },
      );
    }

    const cached = getCacheById(parsed.data.quizId);
    if (cached) {
      return NextResponse.json({ ...cached, cache: true }, { status: 200 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: parsed.data.quizId },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Quiz not found.",
          },
        },
        { status: 404 },
      );
    }

    setCache(quiz, 5);

    return NextResponse.json({ ...quiz, cache: false }, { status: 200 });
  } catch (err) {
    console.error("❌ Request error:", err);

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

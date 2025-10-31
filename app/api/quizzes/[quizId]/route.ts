import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { paramsSchema } from "@/app/schemas/api/quizzes";
import z from "zod";

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

    try {
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

      return NextResponse.json(quiz, { status: 200 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Prisma error:", err);

      return NextResponse.json(
        {
          error: {
            code: "DATABASE_ERROR",
            message:
              "An internal error occurred while fetching the quiz. Please try again later.",
          },
        },
        { status: 500 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
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

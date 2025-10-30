import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId: id } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
    include: {
      questions: { include: { options: true } },
    },
  });

  return NextResponse.json(quiz);
}

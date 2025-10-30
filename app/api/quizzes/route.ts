import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Option, Question } from "@prisma/client";

export async function POST(req: Request) {
  const data = await req.json();

  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map(
          (q: Question & { options: Option[] }, index: number) => ({
            text: q.text,
            order: index,
            options: {
              create: q.options.map((o: Option) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          }),
        ),
      },
    },
    include: {
      questions: { include: { options: true } },
    },
  });

  return NextResponse.json(quiz);
}

"use client";

import { useState } from "react";
import { Option, Question, Quiz } from "@prisma/client";

interface Props {
  placeholder: string;
  name: string;
}

export function Input({ placeholder, name }: Props) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      name={name}
      className="bg-zinc-900 rounded-lg px-3 py-2 outline-none border border-zinc-800 transition focus:border-zinc-700 text-lg w-72"
    />
  );
}

type FormData = Quiz & { questions: (Question & { options: Option[] })[] };

export default function CreateQuizPage() {
  const [quiz, setQuiz] = useState<FormData>({
    id: "geo-quiz-1",
    title: "Quiz de Geografia",
    questions: [
      {
        id: "q1",
        quizId: "geo-quiz-1",
        text: "Qual é a capital da França?",
        order: 0,
        options: [
          { id: "o1", text: "Paris", questionId: "q1", isCorrect: true },
          { id: "o2", text: "Marselha", questionId: "q1", isCorrect: false },
          { id: "o3", text: "Lyon", questionId: "q1", isCorrect: false },
          { id: "o4", text: "Nice", questionId: "q1", isCorrect: false },
        ],
      },
      {
        id: "q2",
        quizId: "geo-quiz-1",
        text: "Qual o maior país do mundo em área territorial?",
        order: 1,
        options: [
          { id: "o5", text: "China", questionId: "q2", isCorrect: false },
          { id: "o6", text: "Rússia", questionId: "q2", isCorrect: true },
          { id: "o7", text: "Canadá", questionId: "q2", isCorrect: false },
          {
            id: "o8",
            text: "Estados Unidos",
            questionId: "q2",
            isCorrect: false,
          },
        ],
      },
    ],
  });

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl">Create Quiz</h1>
      <div className="mt-10">
        <form className="flex flex-col items-center">
          <Input placeholder="Title" name="title" />

          <div className="flex flex-wrap gap-8 my-10">
            {quiz.questions.map((question, qi) => (
              <div
                key={question.id}
                className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-3 border border-zinc-800"
              >
                <input
                  type="text"
                  placeholder={`Question ${qi + 1}`}
                  value={question.text}
                  className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700"
                />

                {question.options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={opt.isCorrect}
                    />
                    <input
                      type="text"
                      placeholder="Option"
                      value={opt.text}
                      className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700 flex-1"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  className="text-sm text-zinc-300 hover:text-white cursor-pointer transition"
                >
                  + Add option
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-zinc-100 text-black rounded-lg cursor-pointer hover:opacity-90 transition"
            >
              Add Question
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:opacity-90 transition"
            >
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

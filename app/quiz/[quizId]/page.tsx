"use client";

import { use, useState } from "react";
import { useViewQuiz } from "./hooks/useViewQuiz";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type Stats = {
  started: Date;
  completed?: Date;
  correct: number;
};

export default function ViewQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);

  const { quiz, loading, error } = useViewQuiz(quizId);
  const [page, setPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState<Stats>({
    started: new Date(),
    correct: 0,
  });
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin w-16 h-16" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p className="font-semibold text-2xl">Error: {error}</p>
        <Link
          className="px-4 py-1.5 bg-zinc-100 text-black rounded-lg mt-4 transition hover:opacity-90"
          href="/"
        >
          Go home
        </Link>
      </div>
    );

  if (!quiz) return notFound();

  const currentQuestion = quiz.questions[page];

  const totalQuestions = quiz?.questions.length || 0;

  const goNext = () => {
    if (page < quiz.questions.length - 1) setPage(page + 1);
    else {
      setCompleted(true);
      setStats((prev) => {
        return { ...prev, completed: new Date() };
      });
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOptions((prev) => {
      const newSelected = [...prev];
      newSelected[page] = optionIndex;
      return newSelected;
    });

    setAnswered((prev) => {
      const newAnswered = [...prev];
      newAnswered[page] = true;
      return newAnswered;
    });

    if (currentQuestion.options[optionIndex].isCorrect)
      setStats((prev) => {
        return { ...prev, correct: prev.correct++ };
      });
  };

  const porcentageMessage = (correct: number) => {
    const messages = [
      {
        min: 0,
        max: 10,
        message: "Don’t worry — every expert starts as a disaster.",
      },
      {
        min: 10,
        max: 30,
        message: "You clearly tried — but guessing doesn’t count as strategy.",
      },
      {
        min: 30,
        max: 50,
        message: "You’ve got the basics. Now refine your aim.",
      },
      {
        min: 50,
        max: 70,
        message: "Good — but not great. Push for that next level.",
      },
      {
        min: 70,
        max: 85,
        message: "That’s impressive — you almost aced it.",
      },
      {
        min: 85,
        max: 99,
        message: "Almost flawless. You’ve earned the bragging rights.",
      },
      {
        min: 100,
        max: 100,
        message: "Unstoppable. Whatever you’re doing — keep doing it.",
      },
    ];

    const porcentage = (correct / totalQuestions) * 100;

    return messages.filter((m) => {
      if (porcentage >= m.min && porcentage <= m.max) return true;
    })[0].message;
  };

  if (completed)
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <h1 className="text-6xl font-semibold">🎊 Completed!</h1>
        <p className="text-xl mt-4">{porcentageMessage(stats.correct)}</p>
        <div className="bg-zinc-900 rounded-lg gap-4 border border-zinc-800 p-4 flex items-center justify-center my-10">
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 w-72 h-30 flex flex-col items-center justify-center relative">
            <span className="right-1 top-1 text-xl absolute">⏱️</span>
            <h1 className="font-semibold text-2xl">Total Time</h1>
            <p className="text-lg">
              {(
                ((stats.completed?.getTime() || stats.started.getTime()) -
                  stats.started.getTime()) /
                1000
              ).toFixed(0)}
              s
            </p>
          </div>
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 w-72 h-30 flex flex-col items-center justify-center relative">
            <span className="right-1 top-1 text-2xl absolute">❇️</span>
            <h1 className="font-semibold text-xl">Total Questions</h1>
            <p className="text-lg">{totalQuestions}</p>
          </div>
          <div className="bg-zinc-800 rounded-lg border border-zinc-700 w-72 h-30 flex flex-col items-center justify-center relative">
            <span className="right-1 top-1 text-2xl absolute">✅</span>
            <h1 className="font-semibold text-xl">Correct Questions</h1>
            <p className="text-lg">{stats.correct}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setPage(0);
              setCompleted(false);
              setStats({ started: new Date(), correct: 0 });
              setSelectedOptions([]);
              setAnswered([]);
            }}
            className="bg-zinc-100 cursor-pointer transition text-black rounded-lg h-10 px-8 hover:opacity-90"
          >
            Play Again
          </button>

          {/* <button
            className="bg-zinc-800 cursor-pointer transition text-white rounded-lg h-10 w-10 hover:opacity-90 flex items-center justify-center"
          >
            <Share2 className="size-5" />
          </button> */}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold">{quiz.title}</h1>

      <div className="flex flex-col w-80 rounded-lg border border-zinc-800 bg-zinc-900 mt-5 p-4">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">{currentQuestion.text}</h2>
          <span className="font-semibold text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center w-6 h-6">
            {page + 1}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptions[page] === idx;
            const isAnswered = answered[page];
            const isCorrect = option.isCorrect;

            let classes =
              "w-full border rounded-lg py-2 px-4 text-start cursor-pointer transition ";
            if (isSelected) {
              if (isAnswered) {
                classes += isCorrect
                  ? "bg-green-500 text-white border-green-700"
                  : "bg-red-500 text-white border-red-700";
              } else {
                classes += "bg-white text-black border-zinc-200";
              }
            } else {
              classes += "bg-zinc-800 border-zinc-700 hover:opacity-90";
            }

            return (
              <button
                key={idx}
                className={classes}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
              >
                {option.text}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={goNext}
            disabled={!answered[page]}
            className={`px-4 py-2 rounded-lg bg-zinc-100 text-black cursor-pointer hover:opacity-90 disabled:opacity-50`}
          >
            {page === quiz.questions.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

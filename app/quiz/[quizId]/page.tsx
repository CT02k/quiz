"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useViewQuiz } from "./hooks/useViewQuiz";
import { useQuizState } from "./hooks/useQuizState";
import { Loader } from "./components/Loader";
import { Error } from "./components/Error";
import { QuizQuestion } from "./components/QuizQuestion";
import { QuizResults } from "./components/QuizResults";

export default function ViewQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);
  const { quiz, loading, error } = useViewQuiz(quizId);
  const {
    page,
    completed,
    selectedOptions,
    answered,
    stats,
    goNext,
    handleSelectOption,
    resetQuiz,
  } = useQuizState(quiz?.questions.length || 0);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!quiz) return notFound();

  const currentQuestion = quiz.questions[page];

  if (completed)
    return (
      <QuizResults
        stats={stats}
        totalQuestions={quiz.questions.length}
        resetQuiz={resetQuiz}
        quizId={quizId}
      />
    );

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold">{quiz.title}</h1>

      <QuizQuestion
        question={currentQuestion}
        page={page}
        selectedOptions={selectedOptions}
        answered={answered}
        handleSelectOption={handleSelectOption}
      />

      <div className="flex justify-end mt-4 w-80">
        <button
          onClick={goNext}
          disabled={!answered[page]}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-black cursor-pointer hover:opacity-90 disabled:opacity-50"
        >
          {page === quiz.questions.length - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import { useViewQuiz } from "./hooks/useViewQuiz";

export default function ViewQuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);

  const { quiz, loading, error } = useViewQuiz(quizId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!quiz) return <p>No quiz found</p>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((q, i) => (
        <div key={i}>
          <h2>{q.text}</h2>
          {q.options.map((o, j) => (
            <p key={j}>
              {o.text} {o.isCorrect ? "*" : ""}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

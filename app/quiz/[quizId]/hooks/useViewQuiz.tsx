"use client";

import { useState, useEffect } from "react";

type OptionData = { text: string; isCorrect: boolean };
type QuestionData = { text: string; options: OptionData[] };
type QuizData = { title: string; questions: QuestionData[] };

export function useViewQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data = await res.json();
        setQuiz(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  return { quiz, loading, error };
}

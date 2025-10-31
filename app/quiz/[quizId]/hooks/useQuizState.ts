import { useState } from "react";
import { Stats } from "../types/stats";

export const useQuizState = (totalQuestions: number) => {
  const [page, setPage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [stats, setStats] = useState<Stats>({
    started: new Date(),
    correct: 0,
  });

  const goNext = () => {
    if (page < totalQuestions - 1) setPage(page + 1);
    else {
      setCompleted(true);
      setStats((prev) => ({ ...prev, completed: new Date() }));
    }
  };

  const handleSelectOption = (optionIndex: number, isCorrect: boolean) => {
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

    if (isCorrect) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    }
  };

  const resetQuiz = () => {
    setPage(0);
    setCompleted(false);
    setSelectedOptions([]);
    setAnswered([]);
    setStats({ started: new Date(), correct: 0 });
  };

  return {
    page,
    completed,
    selectedOptions,
    answered,
    stats,
    goNext,
    handleSelectOption,
    resetQuiz,
    setPage,
  };
};

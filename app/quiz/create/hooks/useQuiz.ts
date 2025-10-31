import { useState } from "react";

type OptionData = { text: string; isCorrect: boolean };
type QuestionData = { text: string; options: OptionData[] };
type QuizData = { title: string; questions: QuestionData[] };

export function useQuiz(initial?: QuizData) {
  const [quiz, setQuiz] = useState<QuizData>(
    initial || {
      title: "",
      questions: [
        {
          text: "",
          options: [
            {
              text: "",
              isCorrect: false,
            },
            {
              text: "",
              isCorrect: false,
            },
          ],
        },
      ],
    },
  );

  const addQuestion = () => {
    const newQuestions = [
      ...quiz.questions,
      {
        text: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ];
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateQuestionText = (qi: number, text: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qi].text = text;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addOption = (qi: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qi].options.push({ text: "", isCorrect: false });
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOptionText = (qi: number, oi: number, text: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qi].options[oi].text = text;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const markCorrect = (qi: number, oi: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qi].options = newQuestions[qi].options.map((opt, i) => ({
      ...opt,
      isCorrect: i === oi,
    }));
    setQuiz({ ...quiz, questions: newQuestions });
  };

  return {
    quiz,
    addQuestion,
    updateQuestionText,
    addOption,
    updateOptionText,
    markCorrect,
    setQuiz,
  };
}

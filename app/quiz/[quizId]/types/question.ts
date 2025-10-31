export type OptionData = { text: string; isCorrect: boolean };
export type QuestionData = { text: string; options: OptionData[] };
export type QuizData = { title: string; questions: QuestionData[] };

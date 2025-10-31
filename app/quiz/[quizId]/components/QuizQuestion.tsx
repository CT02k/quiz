import { QuestionData } from "../types/question";

type QuizQuestionProps = {
  question: QuestionData;
  page: number;
  selectedOptions: number[];
  answered: boolean[];
  handleSelectOption: (idx: number, isCorrect: boolean) => void;
};

export const QuizQuestion = ({
  question,
  page,
  selectedOptions,
  answered,
  handleSelectOption,
}: QuizQuestionProps) => {
  return (
    <div className="flex flex-col w-80 rounded-lg border border-zinc-800 bg-zinc-900 mt-5 p-4">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{question.text}</h2>
        <span className="font-semibold text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center w-6 h-6">
          {page + 1}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptions[page] === idx;
          const isAnswered = answered[page];
          const isCorrect = option.isCorrect;

          let classes =
            "w-full border rounded-lg py-2 px-4 text-start cursor-pointer transition ";
          if (isSelected) {
            if (isAnswered)
              classes += isCorrect
                ? "bg-green-500 text-white border-green-700"
                : "bg-red-500 text-white border-red-700";
            else classes += "bg-white text-black border-zinc-200";
          } else classes += "bg-zinc-800 border-zinc-700 hover:opacity-90";

          return (
            <button
              key={idx}
              className={classes}
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx, isCorrect)}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

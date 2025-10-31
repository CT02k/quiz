import { getPercentageMessage } from "@/app/lib/quiz";
import { getTimeTakenSeconds } from "@/app/lib/time";
import { Stats } from "../types/stats";
import { ShareButton } from "./ShareButton";

type QuizResultsProps = {
  stats: Stats;
  totalQuestions: number;
  resetQuiz: () => void;
  quizId: string;
};

export const QuizResults = ({
  stats,
  totalQuestions,
  resetQuiz,
  quizId,
}: QuizResultsProps) => {
  const timeTaken = getTimeTakenSeconds(stats.started, stats.completed);

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold">🎊 Completed!</h1>
      <p className="text-xl mt-4">
        {getPercentageMessage(stats.correct, totalQuestions)}
      </p>

      <div className="bg-zinc-900 rounded-lg gap-4 border border-zinc-800 p-4 flex items-center justify-center my-10">
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 w-72 h-30 flex flex-col items-center justify-center relative">
          <span className="right-1 top-1 text-xl absolute">⏱️</span>
          <h1 className="font-semibold text-2xl">Total Time</h1>
          <p className="text-lg">{timeTaken}s</p>
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
          onClick={resetQuiz}
          className="bg-zinc-100 cursor-pointer transition text-black rounded-lg h-10 px-8 hover:opacity-90"
        >
          Play Again
        </button>

        <ShareButton
          quizId={quizId}
          stats={{ ...stats, totalQuestions, timeTaken }}
        />
      </div>
    </div>
  );
};

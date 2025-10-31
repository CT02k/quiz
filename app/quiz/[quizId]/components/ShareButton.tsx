import { Share2 } from "lucide-react";
import { useState } from "react";
import { Stats } from "../types/stats";

export function ShareButton({
  quizId,
  stats,
}: {
  quizId: string;
  stats: Stats & { timeTaken: string; totalQuestions: number };
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    const text = `I scored ${stats.correct}/${stats.totalQuestions} in just ${stats.timeTaken}s! Can you beat me? Try it here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this quiz!",
          text,
          url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-zinc-800 cursor-pointer transition text-white rounded-lg h-10 w-10 hover:opacity-90 flex items-center justify-center relative"
    >
      <Share2 className="size-5" />
      {copied && (
        <span className="absolute -top-7.5 text-xs bg-zinc-800 text-white px-2 py-1 rounded">
          Copied!
        </span>
      )}
    </button>
  );
}

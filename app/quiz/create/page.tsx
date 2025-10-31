"use client";
import { useState } from "react";
import { useQuiz } from "./hooks/useQuiz";
import { quizSchema } from "@/app/schemas/create/hook";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    quiz,
    setQuiz,
    updateQuestionText,
    markCorrect,
    updateOptionText,
    addOption,
    addQuestion,
  } = useQuiz();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = quizSchema.safeParse(quiz);
    if (!validation.success) {
      setError(
        JSON.parse(validation.error.message)[0].message || "Validation failed",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      })
        .then((res) => res.json())
        .catch((res) => {
          if (!res) throw new Error("Something went wrong");
        });

      router.push(`/quiz/${res.id}`);
      setSuccess("Quiz created successfully!");
      setQuiz({ title: "", questions: [] });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl">Create Quiz</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-10"
      >
        <input
          type="text"
          placeholder="Title"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          disabled={loading}
          className="bg-zinc-900 rounded-lg px-3 py-2 outline-none border border-zinc-800 transition focus:border-zinc-700 text-lg w-72 disabled:opacity-50"
        />

        <div className="flex flex-wrap gap-8 my-10">
          {quiz.questions.map((question, qi) => (
            <div
              key={qi}
              className="bg-zinc-900 p-4 rounded-xl flex flex-col gap-3 border border-zinc-800"
            >
              <input
                type="text"
                placeholder={`Question ${qi + 1}`}
                value={question.text}
                onChange={(e) => updateQuestionText(qi, e.target.value)}
                disabled={loading}
                className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700 disabled:opacity-50"
              />
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={opt.isCorrect}
                    disabled={loading}
                    className="disabled:opacity-50"
                    onChange={() => markCorrect(qi, oi)}
                  />
                  <input
                    type="text"
                    placeholder="Option"
                    value={opt.text}
                    onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                    disabled={loading}
                    className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700 flex-1 disabled:opacity-50"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOption(qi)}
                disabled={loading}
                className="text-sm text-zinc-300 hover:text-white cursor-pointer transition disabled:opacity-50"
              >
                + Add option
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            disabled={loading}
            className="px-4 py-2 bg-zinc-100 text-black rounded-lg cursor-pointer hover:opacity-90 transition disabled:opacity-50"
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:opacity-90 transition disabled:opacity-50"
          >
            Save Quiz
          </button>
        </div>
      </form>
      {error && (
        <div className="mt-4 py-1.5 px-4 bg-red-700/50 border border-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 py-1.5 px-4 bg-green-700/50 border border-green-700 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}

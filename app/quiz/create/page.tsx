"use client";
import { useQuiz } from "./hooks/useQuiz";

export default function CreateQuizPage() {
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
    const res = await fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quiz),
    });
    const data = await res.json();
    console.log("Created quiz:", data);
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
          className="bg-zinc-900 rounded-lg px-3 py-2 outline-none border border-zinc-800 transition focus:border-zinc-700 text-lg w-72"
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
                className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700"
              />
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={opt.isCorrect}
                    onChange={() => markCorrect(qi, oi)}
                  />
                  <input
                    type="text"
                    placeholder="Option"
                    value={opt.text}
                    onChange={(e) => updateOptionText(qi, oi, e.target.value)}
                    className="bg-zinc-900 px-3 py-2 rounded-lg outline-none border border-zinc-700 flex-1"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOption(qi)}
                className="text-sm text-zinc-300 hover:text-white cursor-pointer transition"
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
            className="px-4 py-2 bg-zinc-100 text-black rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            Add Question
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg cursor-pointer hover:opacity-90 transition"
          >
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

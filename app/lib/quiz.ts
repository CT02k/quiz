export const getPercentageMessage = (
  correct: number,
  totalQuestions: number,
) => {
  const percentage = (correct / totalQuestions) * 100;
  const messages = [
    {
      min: 0,
      max: 10,
      message: "Don’t worry — every expert starts as a disaster.",
    },
    {
      min: 10,
      max: 30,
      message: "You clearly tried — but guessing doesn’t count as strategy.",
    },
    {
      min: 30,
      max: 50,
      message: "You’ve got the basics. Now refine your aim.",
    },
    {
      min: 50,
      max: 70,
      message: "Good — but not great. Push for that next level.",
    },
    { min: 70, max: 85, message: "That’s impressive — you almost aced it." },
    {
      min: 85,
      max: 99,
      message: "Almost flawless. You’ve earned the bragging rights.",
    },
    {
      min: 100,
      max: 100,
      message: "Unstoppable. Whatever you’re doing — keep doing it.",
    },
  ];

  return (
    messages.find((m) => percentage >= m.min && percentage <= m.max)?.message ||
    ""
  );
};

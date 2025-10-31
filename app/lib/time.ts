export const getTimeTakenSeconds = (start: Date, end?: Date) => {
  return Math.floor(
    ((end?.getTime() || new Date().getTime()) - start.getTime()) / 1000,
  );
};

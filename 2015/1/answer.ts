import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const floor = input
    .split("")
    .reduce((floor, char) => floor + (char === "(" ? 1 : -1), 0);
  return [floor.toString(), ""];
};

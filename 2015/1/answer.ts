import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  let basementPos: number = NaN;
  const floor = input.split("").reduce((floor, char, index) => {
    floor += char === "(" ? 1 : -1;
    if (floor === -1 && !basementPos) {
      basementPos = index + 1;
    }
    return floor;
  }, 0);
  return [floor.toString(), basementPos.toString()];
};

import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const total = input.split("\n").reduce((total, line) => {
    const chars = line.split("");
    const leftNum = chars.find((char) => /\d/.exec(char));
    const rightNum = chars.findLast((char) => /\d/.exec(char));
    return total + Number.parseInt(leftNum + rightNum, 10);
  }, 0);

  return [total.toString(), ""];
};

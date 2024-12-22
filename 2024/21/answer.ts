import { AnswerFunction } from "../../answer.ts";
import { RobotKeypad } from "./src/robotKeypad.ts";

export const answer: AnswerFunction = ([input]) => {
  const codes = input.split("\n");
  const robotKeypad = new RobotKeypad(2);
  const totalComplexity = codes
    .map((code) => robotKeypad.getComplexity(code))
    .reduce((total, complexity) => total + complexity, 0);
  return [totalComplexity.toString(), ""];
};

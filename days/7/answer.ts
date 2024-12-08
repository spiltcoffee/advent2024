import { AnswerFunction } from "../../answer.ts";
import { Calibration } from "./src/calibration.ts";

export const answer: AnswerFunction = ([input]) => {
  const calibrations = input
    .split("\n")
    .filter(Boolean)
    .map(Calibration.fromLine);

  const part1Total = calibrations
    .filter((calibration) => calibration.isValidPart1())
    .reduce((total, curr) => total + curr.target, BigInt(0));

  const part2Total = calibrations
    .filter((calibration) => calibration.isValidPart2())
    .reduce((total, curr) => total + curr.target, BigInt(0));

  return [part1Total.toString(), part2Total.toString()];
};

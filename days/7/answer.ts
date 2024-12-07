import { AnswerFunction } from "../../answer.ts";

class Calibration {
  readonly target: number;
  private readonly values: number[];

  private constructor(target: number, values: number[]) {
    this.target = target;
    this.values = values;
  }

  static fromLine(line: string) {
    const [targetStr, valuesStr] = line.split(":");
    const target = Number.parseInt(targetStr, 10);
    if (target > Number.MAX_SAFE_INTEGER) {
      throw new Error(target + "is too big!");
    }
    const values = valuesStr
      .trim()
      .split(" ")
      .map((value) => Number.parseInt(value, 10));
    return new Calibration(target, values);
  }

  private static checkValues(target: number, values: number[]): boolean {
    const [left, right, ...rest] = values;
    if (!right) {
      return left === target;
    } else {
      return (
        Calibration.checkValues(target, [left + right, ...rest]) ||
        Calibration.checkValues(target, [left * right, ...rest])
      );
    }
  }

  isValid(): boolean {
    return Calibration.checkValues(this.target, this.values);
  }
}

export const answer: AnswerFunction = ([input]) => {
  const calibrations = input
    .split("\n")
    .filter(Boolean)
    .map(Calibration.fromLine);

  const validTotal = calibrations
    .filter((calibration) => calibration.isValid())
    .reduce((total, curr) => total + BigInt(curr.target), BigInt(0));

  return [validTotal.toString(), ""];
};

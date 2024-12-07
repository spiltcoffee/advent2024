import { AnswerFunction } from "../../answer.ts";

class Calibration {
  readonly target: bigint;
  private readonly values: bigint[];

  private constructor(target: bigint, values: bigint[]) {
    this.target = target;
    this.values = values;
  }

  static fromLine(line: string) {
    const [targetStr, valuesStr] = line.split(":");
    const target = BigInt(targetStr);
    const values = valuesStr
      .trim()
      .split(" ")
      .map((value) => BigInt(value));
    return new Calibration(target, values);
  }

  private static checkValuesPart1(target: bigint, values: bigint[]): boolean {
    const [left, right, ...rest] = values;
    if (!right) {
      return left === target;
    } else {
      return (
        Calibration.checkValuesPart1(target, [left + right, ...rest]) ||
        Calibration.checkValuesPart1(target, [left * right, ...rest])
      );
    }
  }

  private static checkValuesPart2(target: bigint, values: bigint[]): boolean {
    const [left, right, ...rest] = values;
    if (!right) {
      return left === target;
    } else {
      return (
        Calibration.checkValuesPart2(target, [left + right, ...rest]) ||
        Calibration.checkValuesPart2(target, [left * right, ...rest]) ||
        Calibration.checkValuesPart2(target, [
          BigInt(left.toString() + right.toString()),
          ...rest
        ])
      );
    }
  }

  isValidPart1(): boolean {
    return Calibration.checkValuesPart1(this.target, this.values);
  }

  isValidPart2(): boolean {
    return Calibration.checkValuesPart2(this.target, this.values);
  }
}

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

export class Calibration {
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

import { AnswerFunction } from "../../answer.ts";

enum Operator {
  PLUS = "+",
  MULTPLY = "*",
  POWER = "**"
}

type PartialOperatorFunction = (value: number) => number;
type OperatorFunction = (opValue: number) => PartialOperatorFunction;
type TestFunction = (value: number) => boolean;

const OPERATION_FUNC_MAP: Record<Operator, OperatorFunction> = {
  [Operator.PLUS]: (opValue: number) =>
    function add(value: number) {
      return opValue + value;
    },

  [Operator.MULTPLY]: (opValue: number) =>
    function multiply(value: number) {
      return opValue * value;
    },

  [Operator.POWER]: (opValue: number) =>
    function pow(value: number): number {
      return value ** opValue;
    }
};

class Monkey {
  private items: number[];
  private readonly operation: PartialOperatorFunction;
  private readonly test: TestFunction;
  private readonly trueMonkey: number;
  private readonly falseMonkey: number;

  readonly testValue: number;
  inspections: number;

  private constructor(
    items: number[],
    operation: PartialOperatorFunction,
    test: TestFunction,
    testValue: number,
    trueMonkey: number,
    falseMonkey: number
  ) {
    this.items = items;
    this.inspections = 0;
    this.operation = operation;
    this.test = test;
    this.testValue = testValue;
    this.trueMonkey = trueMonkey;
    this.falseMonkey = falseMonkey;
  }

  static parseInput(input: string): Monkey {
    const [
      ,
      itemsLine,
      operationLine,
      testLine,
      trueThrowToMonkeyLine,
      falseThrowToMonkeyLine
    ] = input.split("\n");

    const items = Monkey.parseItems(itemsLine);
    const operation = Monkey.parseOperation(operationLine);
    const [test, testValue] = Monkey.parseTest(testLine);
    const trueMonkey = Monkey.parseThrowToMonkey(trueThrowToMonkeyLine);
    const falseMonkey = Monkey.parseThrowToMonkey(falseThrowToMonkeyLine);

    return new Monkey(
      items,
      operation,
      test,
      testValue,
      trueMonkey,
      falseMonkey
    );
  }

  static parseItems(input: string): number[] {
    return input
      .split(":")[1]
      .split(",")
      .map((str) => Number.parseInt(str, 10));
  }

  static parseOperation(input: string): PartialOperatorFunction {
    const [, operationPart] = input.split("= old ");
    const [opType, opValueStr] =
      operationPart === "* old"
        ? [Operator.POWER, "2"]
        : <[Operator, string]>operationPart.split(" ", 2);

    const opValue = Number.parseInt(opValueStr, 10);

    return OPERATION_FUNC_MAP[opType](opValue);
  }

  static parseTest(input: string): [TestFunction, number] {
    const opValue = Number(input.split(" ").at(-1));
    return [(value) => value % opValue === 0, opValue];
  }

  static parseThrowToMonkey(input: string): number {
    return Number.parseInt(input.split(" ").at(-1), 10);
  }

  takeTurn(monkeys: Monkey[], worryReduction: number, maxWorry: number): void {
    this.items.forEach((item) => {
      const worryLevel =
        Math.floor(this.operation(item) / worryReduction) % maxWorry;
      const throwToMonkey = this.test(worryLevel)
        ? this.trueMonkey
        : this.falseMonkey;
      monkeys[throwToMonkey].catch(worryLevel);
    });

    this.inspections += this.items.length;
    this.items = [];
  }

  catch(item: number): void {
    this.items.push(item);
  }
}

function findMonkeyBusiness(
  input: string,
  rounds: number,
  worryReduction: number
): number {
  const monkeys = input.split("\n\n").map(Monkey.parseInput);
  const maxWorry = monkeys.reduce(
    (total, monkey) => total * monkey.testValue,
    1
  );

  for (let i = 0; i < rounds; i++) {
    monkeys.forEach((monkey) => {
      monkey.takeTurn(monkeys, worryReduction, maxWorry);
    });
  }

  const inspectionCounts = monkeys
    .map((monkey) => monkey.inspections)
    // sort descending
    .sort((a, b) => b - a);

  return inspectionCounts[0] * inspectionCounts[1];
}

export const answer: AnswerFunction = ([input]) => {
  const part1 = findMonkeyBusiness(input, 20, 3);
  const part2 = findMonkeyBusiness(input, 10000, 1);

  return [part1.toString(), part2.toString()];
};

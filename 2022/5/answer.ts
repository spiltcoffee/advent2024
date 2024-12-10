import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

interface Instruction {
  size: number;
  from: number;
  to: number;
}

function takeStackItem(stackRow) {
  return [stackRow.at(1), stackRow.slice(4)];
}

function parseStacks(input: string) {
  const lines = input.split("\n");
  const stackRows = lines.slice(0, lines.length - 1);
  const positions = lines.at(-1);
  const totalStacks = Number.parseInt(positions.trim().split("").at(-1), 10);
  const resultStacks = range(totalStacks).map<string[]>(() => []);
  stackRows.forEach((stackRow) => {
    let remainingStack = stackRow.split("");
    let stackItem = "";
    let index = 0;
    do {
      [stackItem, remainingStack] = takeStackItem(remainingStack);
      if (stackItem.trim()) {
        resultStacks[index].unshift(stackItem);
      }
      index++;
    } while (remainingStack.length);
  });
  return resultStacks;
}

function parseInstructions(input: string): Instruction[] {
  return input.split("\n").map((line) => {
    const parts = line.split(" ");
    return {
      size: Number.parseInt(parts[1], 10),
      from: Number.parseInt(parts[3], 10),
      to: Number.parseInt(parts[5], 10)
    };
  });
}

function processInstructionOld(
  stacks: string[][],
  { size, from, to }: Instruction
) {
  for (let i = 0; i < size; i++) {
    stacks[to - 1].push(stacks[from - 1].pop());
  }
}

function processInstructionNew(
  stacks: string[][],
  { size, from, to }: Instruction
) {
  const itemsToMove = [];
  for (let i = 0; i < size; i++) {
    itemsToMove.push(stacks[from - 1].pop());
  }
  stacks[to - 1].push(...itemsToMove.reverse());
}

export const answer: AnswerFunction = ([input]) => {
  const [stacksStr, instructionsStr] = input.split("\n\n");
  // can't be fucked making JavaScript be properly immutable argfhsfdkjhjk
  const stacksOld = parseStacks(stacksStr);
  const stacksNew = parseStacks(stacksStr);
  const instructions = parseInstructions(instructionsStr);

  instructions.forEach((instruction) => {
    processInstructionOld(stacksOld, instruction);
    processInstructionNew(stacksNew, instruction);
  });

  const topOfStacksOld = stacksOld.map((stack) => stack.at(-1)).join("");
  const topOfStacksNew = stacksNew.map((stack) => stack.at(-1)).join("");

  return [topOfStacksOld, topOfStacksNew];
};

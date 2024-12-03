import { AnswerFunction } from "../../answer.ts";

const MUL_REGEX = /mul\((\d{1,3}),(\d{1,3})\)/g;
const DONT_REGEX = /don't\(\).*?(do\(\)|$)/gs;

function getMultiplierString(input: string): string {
  return Array.from(
    input.matchAll(MUL_REGEX).map(([_, left, right]) => `${left} * ${right}`)
  ).join(" + ");
}

function stripDisabled(input: string): string {
  return input.split(DONT_REGEX).join("");
}

export const answer: AnswerFunction = ([input]) => {
  const basicResult = eval(getMultiplierString(input));

  const enabledResult = eval(getMultiplierString(stripDisabled(input)));

  return [basicResult.toString(), enabledResult.toString()];
};

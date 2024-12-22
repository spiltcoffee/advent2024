import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

const PRUNE_BY = 2 ** 24 - 1;

function mixAndPrune(s: number): number {
  s = (s ^ (s << 6)) & PRUNE_BY;
  s = (s ^ (s >> 5)) & PRUNE_BY;
  return (s ^ (s << 11)) & PRUNE_BY;
}

export const answer: AnswerFunction = ([input]) => {
  const secretsAfter2000 = input
    .split("\n")
    .map((str) => Number.parseInt(str, 10))
    .map((secret) => range(2000).reduce(mixAndPrune, secret));

  const total = secretsAfter2000.reduce((total, secret) => total + secret, 0);
  return [total.toString(), ""];
};

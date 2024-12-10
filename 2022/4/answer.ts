import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  function toRange(rangeStr: string) {
    const [start, end] = rangeStr.split("-").map(Number);
    return Array.from({ length: end - start + 1 }, (el, i) => i + start);
  }

  function isSuperset(sup: number[], sub: number[]) {
    return sub.every((value) => sup.includes(value));
  }

  function isIntersecting(left: number[], right: number[]) {
    return left.some((value) => right.includes(value));
  }

  const pairs = input.split("\n").map((pair) => {
    const [left, right] = pair.split(",");
    return { left: toRange(left), right: toRange(right) };
  });

  const overlappingPairs = pairs.map(
    ({ left, right }) => isSuperset(left, right) || isSuperset(right, left)
  );

  const intersectingPairs = pairs.map(({ left, right }) =>
    isIntersecting(left, right)
  );

  return [
    overlappingPairs.filter(Boolean).length.toString(),
    intersectingPairs.filter(Boolean).length.toString()
  ];
};

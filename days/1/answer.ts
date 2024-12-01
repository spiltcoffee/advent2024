import { AnswerFunction } from "../../answer.ts";
import zip from "lodash.zip";

export const answer: AnswerFunction = ([input]) => {
  const { leftIds, rightIds } = input
    .split(/\n/)
    .filter(Boolean)
    .reduce(
      ({ leftIds, rightIds }, pair) => {
        const [leftIdStr, rightIdStr] = pair.split(/\s+/);
        return {
          leftIds: leftIds.concat(Number.parseInt(leftIdStr, 10)).toSorted(),
          rightIds: rightIds.concat(Number.parseInt(rightIdStr, 10)).toSorted()
        };
      },
      { leftIds: <number[]>[], rightIds: <number[]>[] }
    );

  const totalDistance = zip(leftIds, rightIds).reduce(
    (total, [left, right]) => {
      if (!left || !right) {
        throw new Error(
          `One of the pair is not defiined! Left: "${left}", Right: "${right}"`
        );
      }

      return total + Math.abs(left - right);
    },
    0
  );

  const similarityScore = leftIds.reduce(
    (total, leftId) =>
      total + leftId * rightIds.filter((rightId) => leftId === rightId).length,
    0
  );

  return [totalDistance.toString(), similarityScore.toString()];
};

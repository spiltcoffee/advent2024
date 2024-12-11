import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

function blink(stones: bigint[]): bigint[] {
  return stones.flatMap((stone) => {
    let stoneStr: string;
    if (stone === 0n) {
      return [1n];
    } else if ((stoneStr = stone.toString()).length % 2 === 0) {
      const halfLength = stoneStr.length / 2;
      return [
        BigInt(stoneStr.substring(0, halfLength)),
        BigInt(stoneStr.substring(halfLength, stoneStr.length))
      ];
    } else {
      return [stone * 2024n];
    }
  });
}

export const answer: AnswerFunction = ([input]) => {
  let stones = input.trim().split(" ").map(BigInt);
  const changedStonesCount = range(25).reduce(blink, stones).length;
  return [changedStonesCount.toString(), ""];
};

import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

class Stone {
  readonly number: number;
  readonly transformTo: number[];
  readonly blinkCount: number[];

  private constructor(number: number, ...transformTo: number[]) {
    this.number = number;
    this.transformTo = transformTo;
    this.blinkCount = [1, transformTo.length];
  }

  static fromNumber(number: number): Stone {
    let numberStr: string;
    if (number === 0) {
      return new Stone(number, 1);
    } else if ((numberStr = number.toString()).length % 2 === 0) {
      const halfLength = numberStr.length / 2;
      return new Stone(
        number,
        Number.parseInt(numberStr.substring(0, halfLength), 10),
        Number.parseInt(numberStr.substring(halfLength, numberStr.length), 10)
      );
    } else {
      return new Stone(number, number * 2024);
    }
  }

  blink(depth: number, graph: StoneGraph): number {
    if (!this.blinkCount[depth]) {
      this.blinkCount[depth] = this.transformTo
        .map((stone) => graph.get(stone))
        .reduce((total, stone) => total + stone.blink(depth - 1, graph), 0);
    }
    return this.blinkCount[depth];
  }
}

class StoneGraph {
  private readonly stones: Stone[] = [];

  get(number: number): Stone {
    let stone = this.stones.find((stone) => stone.number === number);
    if (!stone) {
      stone = Stone.fromNumber(number);
      this.stones.push(stone);
    }

    return stone;
  }
}

export const answer: AnswerFunction = ([input]) => {
  // range(25).reduce(
  //   (stones, timesBlinked) => {
  //     const newStones = blink(stones);
  //     console.log(timesBlinked + 1, stones);
  //     return newStones;
  //   },
  //   [0n]
  // );

  const graph = new StoneGraph();
  const startingStones = input
    .trim()
    .split(" ")
    .map((stoneStr) => Number.parseInt(stoneStr, 10))
    .map((stone) => graph.get(stone));

  range(75).forEach((depth) => {
    startingStones.forEach((stone) => stone.blink(depth, graph));
  });

  const blink25TimesTotal = startingStones.reduce(
    (total, stone) => total + stone.blink(25, graph),
    0
  );

  const blink75TimesTotal = startingStones.reduce(
    (total, stone) => total + stone.blink(75, graph),
    0
  );

  return [blink25TimesTotal.toString(), blink75TimesTotal.toString()];
};

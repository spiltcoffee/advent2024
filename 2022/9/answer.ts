import { AnswerFunction } from "../../answer.ts";

class Coords {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static of(x = 0, y = 0) {
    return new Coords(x, y);
  }

  static copyOf(a: Coords) {
    return Coords.of(a.x, a.y);
  }

  static add(a: Coords, b: Coords) {
    return Coords.of(a.x + b.x, a.y + b.y);
  }

  static substract(a: Coords, b: Coords) {
    return Coords.of(a.x - b.x, a.y - b.y);
  }

  static sign(a: Coords) {
    return Coords.of(Math.sign(a.x), Math.sign(a.y));
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

enum Instruction {
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
  LEFT = "L"
}

const DIRECTION_TO_COORDS: Record<Instruction, Coords> = {
  [Instruction.UP]: Coords.of(0, 1),
  [Instruction.RIGHT]: Coords.of(1, 0),
  [Instruction.DOWN]: Coords.of(0, -1),
  [Instruction.LEFT]: Coords.of(-1, 0)
};

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function moveHead(head: Coords, instruction: Instruction) {
  return Coords.add(head, DIRECTION_TO_COORDS[instruction]);
}

function moveTail(tail: Coords, head: Coords): Coords {
  const gap = Coords.substract(head, tail);
  return Math.abs(gap.x) <= 1 && Math.abs(gap.y) <= 1
    ? Coords.copyOf(tail)
    : Coords.add(tail, Coords.sign(gap));
}

function doAnswer(input: string, tailLength: number) {
  const instructions = input
    .split("\n")
    .flatMap<Instruction, string>((line) => {
      const [direction, distance] = line.split(" ");
      return Array.from(
        { length: Number(distance) },
        () => <Instruction>direction
      );
    });

  const visitedCoords = [];
  let head = Coords.of();
  const tails = Array.from({ length: tailLength }, () => Coords.of());

  instructions.forEach((instruction) => {
    head = moveHead(head, instruction);
    for (let i = 0; i < tails.length; i++) {
      const relativeHead = i > 0 ? tails[i - 1] : head;
      tails[i] = moveTail(tails[i], relativeHead);
    }
    visitedCoords.push(tails.at(-1));
  });

  return unique(visitedCoords.map((coords) => `${coords}`)).length;
}

export const answer: AnswerFunction = ([part1, part2]) => {
  return [
    doAnswer(part1, 1).toString(),
    doAnswer(part2 || part1, 9).toString()
  ];
};

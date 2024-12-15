import { AnswerFunction } from "../../answer.ts";

class GameSet {
  readonly red: number;
  readonly green: number;
  readonly blue: number;

  private constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  static fromObject({
    red,
    green,
    blue
  }: Record<"red" | "green" | "blue", number>): GameSet {
    return new GameSet(red, green, blue);
  }

  static fromString(setStr: string): GameSet {
    const cubeStrs = setStr.split(", ");
    const cubes = cubeStrs.reduce(
      (cubes, cube) => {
        const [value, color] = cube.trim().split(" ");
        return Object.assign(cubes, { [color]: Number.parseInt(value, 10) });
      },
      { red: 0, green: 0, blue: 0 }
    );
    return GameSet.fromObject(cubes);
  }

  isValid(red: number, green: number, blue: number): boolean {
    return this.red <= red && this.green <= green && this.blue <= blue;
  }

  power(): number {
    return (this.red || 1) * (this.green || 1) * (this.blue || 1);
  }
}

class Game {
  readonly id: number;
  private readonly sets: GameSet[];

  private constructor(id: number, sets: GameSet[]) {
    this.id = id;
    this.sets = sets;
  }

  static fromLine(line: string): Game {
    const [gameStr, allSetsStr] = line.split(":");
    const [, idStr] = gameStr.split("Game ");
    const gameSetStrs = allSetsStr.split(";");
    const gameSets = gameSetStrs.map(GameSet.fromString);
    return new Game(Number.parseInt(idStr, 10), gameSets);
  }

  isValid(red: number, green: number, blue: number): boolean {
    return this.sets.every((set) => set.isValid(red, green, blue));
  }

  findMinimumSet(): GameSet {
    const minimums = this.sets.reduce(
      (minimums, set) => {
        if (set.red > minimums.red) {
          minimums.red = set.red;
        }
        if (set.green > minimums.green) {
          minimums.green = set.green;
        }
        if (set.blue > minimums.blue) {
          minimums.blue = set.blue;
        }
        return minimums;
      },
      { red: 0, green: 0, blue: 0 }
    );
    return GameSet.fromObject(minimums);
  }
}

export const answer: AnswerFunction = ([input]) => {
  const games = input.split("\n").map(Game.fromLine);
  const sumOfValidIds = games
    .filter((game) => game.isValid(12, 13, 14))
    .reduce((total, game) => total + game.id, 0);
  const sumOfMinimumPowers = games
    .map((game) => game.findMinimumSet())
    .map((gameSet) => gameSet.power())
    .reduce((total, power) => total + power, 0);
  return [sumOfValidIds.toString(), sumOfMinimumPowers.toString()];
};

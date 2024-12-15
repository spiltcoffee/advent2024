import { AnswerFunction } from "../../answer.ts";

class GameSet {
  private readonly red: number;
  private readonly green: number;
  private readonly blue: number;

  private constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
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
    return new GameSet(cubes.red, cubes.green, cubes.blue);
  }

  isValid(red: number, green: number, blue: number): boolean {
    return this.red <= red && this.green <= green && this.blue <= blue;
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
}

export const answer: AnswerFunction = ([input]) => {
  const games = input.split("\n").map(Game.fromLine);
  const sumOfValidIds = games
    .filter((game) => game.isValid(12, 13, 14))
    .reduce((total, game) => total + game.id, 0);
  return [sumOfValidIds.toString(), ""];
};

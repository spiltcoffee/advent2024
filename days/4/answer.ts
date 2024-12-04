import { AnswerFunction } from "../../answer.ts";
import range from "lodash.range";

class Coordinate {
  readonly x: number;
  /** This `y` coordinate is "flipped" in comparison to it's usual representation on the Cartesean plane */
  readonly y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(otherCoord: Coordinate): Coordinate {
    return new Coordinate(this.x + otherCoord.x, this.y + otherCoord.y);
  }
}

enum Direction {
  NORTH_EAST = "NE",
  EAST = "E",
  SOUTH_EAST = "SE",
  SOUTH = "S"
}

const DIRECTION_COORDS: Record<Direction, Coordinate> = {
  [Direction.NORTH_EAST]: new Coordinate(-1, 1),
  [Direction.EAST]: new Coordinate(0, 1),
  [Direction.SOUTH_EAST]: new Coordinate(1, 1),
  [Direction.SOUTH]: new Coordinate(-1, 0)
};

class WordSearch {
  private readonly wordsearch: string[][];
  readonly width: number;
  readonly height: number;

  constructor(input: string) {
    this.wordsearch = input
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split(""));

    this.height = this.wordsearch.length;
    this.width = this.wordsearch[0].length;
  }

  map<T>(callback: (coord: Coordinate) => T): T[] {
    return range(this.height).flatMap((y) =>
      range(this.width).flatMap((x) => callback(new Coordinate(x, y)))
    );
  }

  private getCoord(coord: Coordinate): string | undefined {
    return (this.wordsearch[coord.y] ?? [])[coord.x];
  }

  private getStringFromCoords(coords: Coordinate[]): string {
    return coords
      .map((coord) => this.getCoord(coord))
      .filter(Boolean)
      .join("");
  }

  private buildDirectionCoordinates(
    startCoord: Coordinate,
    direction: Direction
  ): Coordinate[] {
    const directionCoord = DIRECTION_COORDS[direction];

    return range(3).reduce(
      (coords) => {
        return [...coords, coords.at(-1).add(directionCoord)];
      },
      [startCoord]
    );
  }

  private checkForXmasLine(coords: Coordinate[]): boolean {
    return ["XMAS", "SAMX"].includes(this.getStringFromCoords(coords));
  }

  private checkForMasCross(coords: Coordinate[]): boolean {
    return ["MSMS", "MMSS", "SMSM", "SSMM"].includes(
      this.getStringFromCoords(coords)
    );
  }

  findXmasLine(
    startCoord: Coordinate
  ): Array<{ coords: Coordinate[] } | false> {
    return Object.values(Direction).map((direction) => {
      const coords = this.buildDirectionCoordinates(startCoord, direction);
      return this.checkForXmasLine(coords) ? { coords } : false;
    });
  }

  findMasCross(startCoord: Coordinate): { coords: Coordinate[] } | false {
    if (this.getCoord(startCoord) !== "A") {
      return false;
    }

    const coords = [
      new Coordinate(-1, -1),
      new Coordinate(1, -1),
      new Coordinate(-1, 1),
      new Coordinate(1, 1)
    ].map((crossCoord) => startCoord.add(crossCoord));

    return this.checkForMasCross(coords) ? { coords } : false;
  }
}

export const answer: AnswerFunction = ([input]) => {
  const wordsearch = new WordSearch(input);

  const xmasLineFinds = wordsearch
    .map((currentCoord) => wordsearch.findXmasLine(currentCoord))
    .filter(Boolean).length;

  const maxCrossFinds = wordsearch
    .map((currentCoord) => wordsearch.findMasCross(currentCoord))
    .filter(Boolean).length;

  return [xmasLineFinds.toString(), maxCrossFinds.toString()];
};

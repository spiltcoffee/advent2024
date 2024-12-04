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

class WordSearch {
  private readonly wordsearch: string[][];
  readonly width: number;
  readonly height: number;

  constructor(input: string) {
    this.wordsearch = input
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split(""));

    this.width = this.wordsearch[0].length;
    this.height = this.wordsearch.length;
  }

  map<T>(callback: (coord: Coordinate) => T): T[] {
    return range(this.width).flatMap((x) =>
      range(this.height).flatMap((y) => callback(new Coordinate(x, y)))
    );
  }

  private getCoord(coord: Coordinate): string | undefined {
    return (this.wordsearch[coord.x] ?? [])[coord.y];
  }

  checkCoords(coords: Coordinate[]) {
    return coords.map((coord) => this.getCoord(coord)).join("") === "XMAS";
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

function buildCoordinates(
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

export const answer: AnswerFunction = ([input]) => {
  const wordsearch = new WordSearch(input);

  const finds = wordsearch.map((currentCoord) => {
    return Object.values(Direction).map((direction) => {
      let coords = buildCoordinates(currentCoord, direction);

      return wordsearch.checkCoords(coords)
        ? { coords }
        : ((coords = coords.toReversed()),
          wordsearch.checkCoords(coords) ? { coords } : false);
    });
  });

  return [finds.filter(Boolean).length.toString(), ""];
};

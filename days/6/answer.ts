import { dir } from "console";
import { AnswerFunction } from "../../answer.ts";
import range from "lodash.range";

enum TileType {
  FLOOR,
  WALL
}

enum Direction {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W"
}

const FACING: Record<string, Direction> = {
  "^": Direction.NORTH,
  ">": Direction.EAST,
  V: Direction.SOUTH,
  "<": Direction.WEST
};

const ROTATION: Record<Direction, Direction> = {
  [Direction.NORTH]: Direction.EAST,
  [Direction.EAST]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.WEST,
  [Direction.WEST]: Direction.NORTH
};

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

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  equal(otherCoord: Coordinate): boolean {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  }
}

const VECTOR: Record<Direction, Coordinate> = {
  [Direction.NORTH]: new Coordinate(0, -1),
  [Direction.EAST]: new Coordinate(1, 0),
  [Direction.SOUTH]: new Coordinate(0, 1),
  [Direction.WEST]: new Coordinate(-1, 0)
};

class Map {
  readonly map: TileType[][];
  readonly visited: boolean[][];
  private constructor(map: TileType[][], visited: boolean[][]) {
    this.map = map;
    this.visited = visited;
  }

  getTileType(coord: Coordinate): TileType {
    return (this.map[coord.y] ?? [])[coord.x];
  }

  visit(coord: Coordinate) {
    if ((this.visited[coord.y] ?? [])[coord.x] !== undefined) {
      this.visited[coord.y][coord.x] = true;
    }
  }

  get visitedCount(): number {
    return this.visited.flatMap((row) => row).filter(Boolean).length;
  }

  static parseMap(input: string): Map {
    const map = input
      .split("\n")
      .map((row) =>
        row
          .split("")
          .map((tile) => (tile === "#" ? TileType.WALL : TileType.FLOOR))
      );

    const visited = map.map((row) => row.map(() => false));
    return new Map(map, visited);
  }
}

class Guard {
  private coord: Coordinate;
  private direction: Direction;
  private readonly start: Coordinate;

  private constructor(coord: Coordinate, direction: Direction) {
    this.coord = coord;
    this.direction = direction;

    this.start = coord.clone();
  }

  move(map: Map) {
    const nextCoord = this.coord.add(VECTOR[this.direction]);
    if (map.getTileType(nextCoord) === TileType.WALL) {
      this.direction = ROTATION[this.direction];
    } else {
      this.coord = nextCoord;
    }
  }

  isInMap(map: Map): boolean {
    return map.getTileType(this.coord) !== undefined;
  }

  visitMap(map: Map) {
    map.visit(this.coord);
  }

  static parseGuard(input: string) {
    let coord: Coordinate;
    let direction: Direction;
    input.split("\n").some((row, y) =>
      row.split("").some((col, x) => {
        if (Object.keys(FACING).includes(col)) {
          coord = new Coordinate(x, y);
          direction = FACING[col];
          return true;
        }
        return false;
      })
    );

    return new Guard(coord, direction);
  }
}

export const answer: AnswerFunction = ([input]) => {
  const map = Map.parseMap(input);
  const guard = Guard.parseGuard(input);

  while (guard.isInMap(map)) {
    guard.visitMap(map);
    guard.move(map);
  }

  return [map.visitedCount.toString(), ""];
};

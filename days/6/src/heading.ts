import { Coordinate } from "./coordinate.ts";

export enum Direction {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W"
}

const ROTATION: Record<Direction, Direction> = {
  [Direction.NORTH]: Direction.EAST,
  [Direction.EAST]: Direction.SOUTH,
  [Direction.SOUTH]: Direction.WEST,
  [Direction.WEST]: Direction.NORTH
};

const DIRECTION_VECTOR: Record<Direction, Coordinate> = {
  [Direction.NORTH]: new Coordinate(0, -1),
  [Direction.EAST]: new Coordinate(1, 0),
  [Direction.SOUTH]: new Coordinate(0, 1),
  [Direction.WEST]: new Coordinate(-1, 0)
};

export class Heading {
  readonly coord: Coordinate;
  readonly direction: Direction;

  constructor(coord: Coordinate, direction: Direction) {
    this.coord = coord;
    this.direction = direction;
  }

  turn(): Heading {
    return new Heading(this.coord, ROTATION[this.direction]);
  }

  move(): Heading {
    return new Heading(
      this.coord.add(DIRECTION_VECTOR[this.direction]),
      this.direction
    );
  }

  equals(otherHeading: Heading): boolean {
    return (
      this.direction === otherHeading.direction &&
      this.coord.equals(otherHeading.coord)
    );
  }
}

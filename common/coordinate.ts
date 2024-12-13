import { Direction } from "./direction.ts";

export class Coordinate {
  readonly x: number;
  /** This `y` coordinate is "flipped" in comparison to it's usual representation on the Cartesean plane */
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static readonly ORIGIN = new Coordinate(0, 0);

  private static readonly DIRECTION_COORDINATES: Record<Direction, Coordinate> =
    {
      [Direction.NORTH]: new Coordinate(0, -1),
      [Direction.NORTH_EAST]: new Coordinate(1, -1),
      [Direction.EAST]: new Coordinate(1, 0),
      [Direction.SOUTH_EAST]: new Coordinate(1, 1),
      [Direction.SOUTH]: new Coordinate(0, 1),
      [Direction.SOUTH_WEST]: new Coordinate(-1, 1),
      [Direction.WEST]: new Coordinate(-1, 0),
      [Direction.NORTH_WEST]: new Coordinate(-1, -1)
    };

  static fromDirection(direction: Direction): Coordinate {
    return this.DIRECTION_COORDINATES[direction];
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  add(otherCoord: Coordinate): Coordinate {
    return new Coordinate(this.x + otherCoord.x, this.y + otherCoord.y);
  }

  vectorToCoord(otherCoord: Coordinate): Coordinate {
    return new Coordinate(otherCoord.x - this.x, otherCoord.y - this.y);
  }

  inverseVector(): Coordinate {
    return new Coordinate(-this.x, -this.y);
  }

  equals(otherCoord: Coordinate): boolean {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  }

  toString(): string {
    return `[${this.x}, ${this.y}]`;
  }
}

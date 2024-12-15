import { Direction } from "./direction.ts";

function modulo(n: number, d: number) {
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
  return ((n % d) + d) % d;
}

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
    return Coordinate.DIRECTION_COORDINATES[direction];
  }

  wrap(limit: Coordinate): Coordinate {
    return new Coordinate(
      modulo(this.x, limit.x + 1),
      modulo(this.y, limit.y + 1)
    );
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  add(otherCoord: Coordinate): Coordinate {
    return new Coordinate(this.x + otherCoord.x, this.y + otherCoord.y);
  }

  subtract(otherCoord: Coordinate): Coordinate {
    return new Coordinate(this.x - otherCoord.x, this.y - otherCoord.y);
  }

  multiply(multiplier: number): Coordinate {
    return new Coordinate(this.x * multiplier, this.y * multiplier);
  }

  equals(otherCoord: Coordinate): boolean {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  }

  toString(): string {
    return `[${this.x}, ${this.y}]`;
  }
}

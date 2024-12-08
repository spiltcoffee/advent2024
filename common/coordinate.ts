import { Direction } from "./direction.ts";

export class Coordinate {
  readonly x: number;
  /** This `y` coordinate is "flipped" in comparison to it's usual representation on the Cartesean plane */
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromDirection(direction: Direction): Coordinate {
    switch (direction) {
      case Direction.NORTH:
        return new Coordinate(0, -1);
      case Direction.NORTH_EAST:
        return new Coordinate(1, -1);
      case Direction.EAST:
        return new Coordinate(1, 0);
      case Direction.SOUTH_EAST:
        return new Coordinate(1, 1);
      case Direction.SOUTH:
        return new Coordinate(0, 1);
      case Direction.SOUTH_WEST:
        return new Coordinate(-1, 1);
      case Direction.WEST:
        return new Coordinate(-1, 0);
      case Direction.NORTH_WEST:
        return new Coordinate(-1, -1);
    }
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

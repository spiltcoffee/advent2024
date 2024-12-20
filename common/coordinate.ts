import { BigNumber } from "bignumber.js";
import { Direction } from "./direction.ts";
import { modulo } from "./modulo.ts";

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

  static taxicabBetween(first: Coordinate, second: Coordinate): number {
    return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
  }

  static magnitudeBetween(first: Coordinate, second: Coordinate): number {
    return new BigNumber(first.x - second.x)
      .pow(2)
      .plus(new BigNumber(first.y - second.y).pow(2))
      .sqrt()
      .toNumber();
  }

  directionTo(otherCoord: Coordinate, exactMatch = false): Direction {
    const { x, y } = otherCoord.subtract(this);

    if (y === 0) {
      if (x > 0) {
        return Direction.EAST;
      } else if (x < 0) {
        return Direction.WEST;
      }
    } else if (x === 0) {
      if (y > 0) {
        return Direction.SOUTH;
      } else if (y < 0) {
        return Direction.NORTH;
      }
    } else if (Math.abs(x) === Math.abs(y) && x !== 0) {
      const xSign = Math.sign(x);
      const ySign = Math.sign(y);
      if (ySign > 0) {
        if (xSign > 0) {
          return Direction.SOUTH_EAST;
        } else if (xSign < 0) {
          return Direction.SOUTH_WEST;
        }
      } else if (ySign < 0) {
        if (xSign > 0) {
          return Direction.NORTH_EAST;
        } else if (xSign < 0) {
          return Direction.NORTH_WEST;
        }
      }
    }

    if (exactMatch) {
      throw new Error(
        `Could not find direction between ${this} and ${otherCoord}`
      );
    } else {
      const angle = (Math.atan2(y, x) * 180) / Math.PI;
      const index = Math.round(angle / 45) + 3;
      return [
        Direction.NORTH_WEST,
        Direction.NORTH,
        Direction.NORTH_EAST,
        Direction.EAST,
        Direction.SOUTH_EAST,
        Direction.SOUTH,
        Direction.SOUTH_WEST,
        Direction.WEST
      ][index];
    }
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

  equals(otherCoord: Coordinate): boolean {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  }

  toString(): string {
    return `[${this.x}, ${this.y}]`;
  }
}

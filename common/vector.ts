import { Coordinate } from "./coordinate.ts";
import { Direction } from "./direction.ts";

export class Vector extends Coordinate {
  #magnitude: number;
  #angle: number;
  constructor(x: number, y: number) {
    super(x, y);
  }

  static fromCoord(coord: Coordinate) {
    return new Vector(coord.x, coord.y);
  }

  static fromDirection(direction: Direction): Coordinate {
    return this.fromCoord(super.fromDirection(direction));
  }

  static fromCoordToCoord(fromCoord: Coordinate, toCoord: Coordinate): Vector {
    return new Vector(toCoord.x - fromCoord.x, toCoord.y - fromCoord.y);
  }

  inverse(): Vector {
    return new Vector(-this.x, -this.y);
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  add(otherCoord: Coordinate): Vector;
  add(otherVector: Vector): Vector;
  add(otherCoordLike: Coordinate): Vector {
    return new Vector(this.x + otherCoordLike.x, this.y + otherCoordLike.y);
  }

  subtract(otherCoord: Coordinate): Vector;
  subtract(otherVector: Vector): Vector;
  subtract(otherCoordLike: Coordinate): Vector {
    return new Vector(this.x - otherCoordLike.x, this.y - otherCoordLike.y);
  }

  get magnitude(): number {
    if (this.#magnitude === undefined) {
      this.#magnitude = Math.sqrt(
        Math.abs(this.x) ** 2 + Math.abs(this.y) ** 2
      );
    }
    return this.#magnitude;
  }

  get angle(): number {
    if (this.#angle === undefined) {
      if (this.x === 0) {
        if (this.y === 0) {
          this.#angle = NaN;
        } else if (this.y > 0) {
          this.#angle = 90;
        } else {
          this.#angle = 270;
        }
      } else {
        this.#angle = (Math.atan(this.y / this.x) * 180) / Math.PI;
      }
    }

    return this.#angle;
  }
}

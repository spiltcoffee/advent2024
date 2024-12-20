import { BigNumber } from "bignumber.js";
import { Coordinate } from "./coordinate.ts";
import { Direction } from "./direction.ts";
import { Memoize } from "fast-typescript-memoize";

type Radians = number;

export class Vector extends Coordinate {
  constructor(x: number, y: number) {
    super(x, y);
  }

  static fromCoord(coord: Coordinate): Vector {
    return new Vector(coord.x, coord.y);
  }

  static fromDirection(direction: Direction): Vector {
    return this.fromCoord(super.fromDirection(direction));
  }

  static fromCoordToCoord(fromCoord: Coordinate, toCoord: Coordinate): Vector {
    return new Vector(toCoord.x - fromCoord.x, toCoord.y - fromCoord.y);
  }

  static angleBetween(u: Vector, v: Vector): Radians {
    const ux = new BigNumber(u.x);
    const uy = new BigNumber(u.y);
    const uMag = new BigNumber(u.magnitude);
    const vMag = new BigNumber(v.magnitude);
    const vx = new BigNumber(v.x);
    const vy = new BigNumber(v.y);

    const dotProduct = ux.multipliedBy(vx).plus(uy.multipliedBy(vy));
    return Math.acos(dotProduct.dividedBy(uMag.multipliedBy(vMag)).toNumber());
  }

  /**
   *
   * @param alpha Angle opposite to output
   * @param mag Magnitude of the side adjacent to output
   * @param beta Angle adjacent to output
   * @returns The magnitude of the side opposite to the alpha angle
   */
  static magnitudeFromAngleSideAngle(
    alpha: number,
    mag: number,
    beta: number
  ): number {
    return new BigNumber(mag)
      .multipliedBy(new BigNumber(Math.sin(alpha) / Math.sin(alpha + beta)))
      .toNumber();
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

  multiply(multiplier: number): Vector {
    return new Vector(this.x * multiplier, this.y * multiplier);
  }

  @Memoize()
  get magnitude(): number {
    return Coordinate.magnitudeBetween(this, Coordinate.ORIGIN);
  }

  @Memoize()
  get angle(): Radians {
    if (this.x === 0) {
      if (this.y === 0) {
        return NaN;
      } else if (this.y > 0) {
        return 90;
      } else {
        return 270;
      }
    } else {
      return Math.atan(this.y / this.x);
    }
  }
}

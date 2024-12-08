export class Coordinate {
  readonly x: number;
  /** This `y` coordinate is "flipped" in comparison to it's usual representation on the Cartesean plane */
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  add(otherCoord: Coordinate): Coordinate {
    return new Coordinate(this.x + otherCoord.x, this.y + otherCoord.y);
  }

  vectorTo(otherCoord: Coordinate): Coordinate {
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

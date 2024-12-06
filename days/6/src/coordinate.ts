export class Coordinate {
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

  equals(otherCoord: Coordinate): boolean {
    return this.x === otherCoord.x && this.y === otherCoord.y;
  }
}

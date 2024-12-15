import { Tile } from "./tile.ts";

export class Robot extends Tile {
  draw(): string {
    return "@";
  }

  toString(): string {
    return "Robot";
  }
}

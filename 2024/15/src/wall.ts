import { Tile } from "./tile.ts";

export class Wall extends Tile {
  canMove(): boolean {
    return false;
  }

  draw(): string {
    return "#";
  }

  toString(): string {
    return "Wall";
  }
}

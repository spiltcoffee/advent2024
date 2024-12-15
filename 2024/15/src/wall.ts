import { Tile } from "./tile.ts";

export class Wall extends Tile {
  move(): boolean {
    return false;
  }
}

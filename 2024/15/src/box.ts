import { Tile } from "./tile.ts";

export class Box extends Tile {
  get gpsCoordinate(): number {
    return this.coordinate.y * 100 + this.coordinate.x;
  }
}

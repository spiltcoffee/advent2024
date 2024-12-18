import { Tile } from "./tile.ts";

export class EndTile extends Tile {
  getShortestPaths(): Tile[][] {
    return super.getShortestPaths(null);
  }
}

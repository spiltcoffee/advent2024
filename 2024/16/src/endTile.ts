import { Tile } from "./tile.ts";

export class EndTile extends Tile {
  getShortestPath(): Tile[] {
    if (!this.paths.length) {
      throw new Error(`Paths are not defined for ${this}`);
    }

    const preferredPath = this.paths
      .toSorted((a, b) => a.distance - b.distance)
      .at(0);
    return preferredPath.parent.getShortestPath(this).concat(this);
  }
}

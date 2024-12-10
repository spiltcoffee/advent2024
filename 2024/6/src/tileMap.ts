import { Map } from "./map.ts";
import type { Heading } from "./heading.ts";

export enum TileType {
  FLOOR,
  WALL
}

export class TileMap extends Map<TileType> {
  static fromInput(input: string): TileMap {
    return new TileMap(
      input
        .split("\n")
        .map((row) =>
          row
            .split("")
            .map((tile) => (tile === "#" ? TileType.WALL : TileType.FLOOR))
        )
    );
  }

  hasWallInHeading(heading: Heading): boolean {
    while (this.isMapCell(heading.coord)) {
      if (this.getMapCell(heading.coord) === TileType.WALL) {
        return true;
      }
      heading = heading.move();
    }
    return false;
  }
}

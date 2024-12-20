import { Memoize } from "fast-typescript-memoize";
import { Coordinate } from "../../../common/coordinate.ts";
import { Map } from "../../../common/map.ts";
import { EndTile } from "./endTile.ts";
import { FloorTile } from "./floorTile.ts";
import { StartTile } from "./startTile.ts";
import { Tile } from "./tile.ts";
import { WallTile } from "./wallTile.ts";

export class RaceTrack extends Map<Tile> {
  static fromInput(input: string): RaceTrack {
    const raceTrack = new RaceTrack(
      input.split("\n").map((row, y) =>
        row.split("").map((cell, x) => {
          const coordinate = new Coordinate(x, y);
          switch (cell) {
            case "#":
              return new WallTile(coordinate);
            case ".":
              return new FloorTile(coordinate);
            case "S":
              return new StartTile(coordinate);
            case "E":
              return new EndTile(coordinate);
          }
        })
      )
    );
    raceTrack.findPath();
    return raceTrack;
  }

  getTotalCheatsAtOrAbove(minimumCheat: number) {
    return this.getAllCells()
      .filter((tile) => tile instanceof WallTile)
      .reduce(
        (totalCheats, wallTile) =>
          totalCheats + wallTile.getTotalCheatsAtOrAbove(this, minimumCheat),
        0
      );
  }

  @Memoize()
  private get endTile(): Tile {
    return this.getAllCells().find((tile) => tile instanceof EndTile);
  }

  @Memoize()
  private get startTile(): Tile {
    return this.getAllCells().find((tile) => tile instanceof StartTile);
  }

  private findPath() {
    let nextTile = this.startTile;
    let distance = 0;
    nextTile.distance = distance;
    while (nextTile) {
      nextTile.distance = distance;
      nextTile = nextTile.getNextTile(this);
      distance++;
    }
  }
}

import { Memoize } from "fast-typescript-memoize";
import { Coordinate } from "../../../common/coordinate.ts";
import { Map } from "../../../common/map.ts";
import { EndTile } from "./endTile.ts";
import { FloorTile } from "./floorTile.ts";
import { StartTile } from "./startTile.ts";
import { Tile } from "./tile.ts";
import { WallTile } from "./wallTile.ts";
import range from "lodash.range";

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

  private buildTilesToScan(cheatDistance: number): Coordinate[] {
    const yTileDistance = cheatDistance + 1;
    const tiles = range(yTileDistance).map((y) => {
      const xTileDistance = yTileDistance - Math.abs(y);
      return range(xTileDistance * -1 + 1, xTileDistance)
        .filter((x) => y > 1 || (y > 0 && Math.abs(x) > 1) || x > 1)
        .map((x) => new Coordinate(x, y));
    });

    return tiles.flatMap((row) => row);
  }

  getTotalCheatsAtOrAbove(cheatDistance: number, minimumCheat: number) {
    const tilesToScan = this.buildTilesToScan(cheatDistance);

    const cheats = this.getAllCells()
      .filter((tile) => tile.movable)
      .flatMap((tiles) =>
        tiles.getTotalCheatsAtOrAbove(this, tilesToScan, minimumCheat)
      );

    return cheats.length;
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

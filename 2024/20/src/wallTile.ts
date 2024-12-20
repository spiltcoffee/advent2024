import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { RaceTrack } from "./raceTrack.ts";
import { Tile } from "./tile.ts";

export class WallTile extends Tile {
  static readonly HORIZONTAL_NEIGHBOURS = [Direction.WEST, Direction.EAST].map(
    Coordinate.fromDirection
  );

  static readonly VERTICAL_NEIGHBOURS = [Direction.NORTH, Direction.SOUTH].map(
    Coordinate.fromDirection
  );

  get movable(): boolean {
    return false;
  }

  getTotalCheatsAtOrAbove(map: RaceTrack, minimumCheat: number): number {
    return [
      this.checkCheat(map, WallTile.HORIZONTAL_NEIGHBOURS),
      this.checkCheat(map, WallTile.VERTICAL_NEIGHBOURS)
    ].filter((cheat) => cheat >= minimumCheat).length;
  }

  private checkCheat(map: RaceTrack, neighbourCoordinates: Coordinate[]) {
    const [first, second] = map
      .getMapCells(
        neighbourCoordinates.map((coordinate) =>
          coordinate.add(this.coordinate)
        )
      )
      .filter((neighbour) => neighbour.movable);

    if (!(first && second)) {
      return NaN;
    }

    return Math.abs(first.distance - second.distance) - 2;
  }
}

import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
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
}

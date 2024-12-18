import { Direction } from "../../../common/direction.ts";
import { Tile } from "./tile.ts";

export class StartTile extends Tile {
  get distance(): number {
    return 0;
  }

  get direction(): Direction {
    return Direction.EAST;
  }

  distanceTo(otherTile: Tile): number {
    return this.directionTo(otherTile) === Direction.EAST ? 1 : 1001;
  }

  getShortestPaths(): Tile[][] {
    return [[this]];
  }
}

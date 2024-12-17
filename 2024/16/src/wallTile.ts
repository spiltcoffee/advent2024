import { Direction } from "../../../common/direction.ts";
import { Tile } from "./tile.ts";

export class WallTile extends Tile {
  get movable(): boolean {
    return false;
  }

  get direction(): Direction {
    throw new Error("Not implemented");
  }

  get distance(): number {
    throw new Error("Not implemented");
  }

  get parent(): Tile {
    throw new Error("Not implemented");
  }
}

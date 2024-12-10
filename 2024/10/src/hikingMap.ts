import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { Map } from "../../../common/map.ts";
import { Trail } from "./trail.ts";

const NEARBY_COORDS = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST
].map(Coordinate.fromDirection);

export class HikingMap extends Map<Trail> {
  static fromInput(input: string): HikingMap {
    const hikingMap = new HikingMap(
      input
        .split("\n")
        .filter(Boolean)
        .map((row, y) =>
          row
            .split("")
            .map(
              (cell, x) =>
                new Trail(Number.parseInt(cell, 10), new Coordinate(x, y))
            )
        )
    );

    return hikingMap;
  }

  linkTrails() {
    this.forEachMapCell((trail, coord) => {
      trail.addHigherTrails(
        this.getMapCells(
          NEARBY_COORDS.map((surroundingCoord) => coord.add(surroundingCoord))
        )
      );
    });
  }

  getTrailHeadScores(): Array<{
    trailEnds: number;
    distinctTrailEnds: number;
  }> {
    return this.getAllCells()
      .filter(({ isLowest }) => isLowest)
      .map((trail) => trail.getTrailHeadScores())
      .filter(Boolean);
  }
}

import range from "lodash.range";
import { Map } from "./map.ts";
import type { Coordinate } from "./coordinate.ts";
import type { Heading } from "./heading.ts";

export class MarkingMap extends Map<boolean> {
  static fromMap(map: Map<unknown>): MarkingMap {
    return new MarkingMap(
      range(map.height).map(() => range(map.width).map(() => false))
    );
  }

  get count(): number {
    return this.map.flatMap((row) => row).filter(Boolean).length;
  }

  allMarkedBetween(heading: Heading, endCoord: Coordinate): boolean {
    while (!heading.coord.equals(endCoord)) {
      if (!this.getMapCell(heading.coord)) {
        return false;
      }
      heading = heading.move();
    }
    return true;
  }
}

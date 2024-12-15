import { Coordinate } from "../../../common/coordinate.ts";
import { CardinalDirection } from "../../../common/direction.ts";
import { Warehouse } from "./warehouse.ts";

export abstract class Tile {
  protected coordinate: Coordinate;

  constructor(coordinate: Coordinate) {
    this.coordinate = coordinate;
  }

  move(direction: CardinalDirection, warehouse: Warehouse): boolean {
    const nextCoord = this.coordinate.add(Coordinate.fromDirection(direction));
    const nextTile = warehouse.getMapCell(nextCoord);

    if (nextTile && !nextTile.move(direction, warehouse)) {
      return false;
    }

    warehouse.setMapCell(this.coordinate, null);
    warehouse.setMapCell(nextCoord, this);
    this.coordinate = nextCoord;

    return true;
  }
}

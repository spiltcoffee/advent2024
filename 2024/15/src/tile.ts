import { Coordinate } from "../../../common/coordinate.ts";
import { CardinalDirection } from "../../../common/direction.ts";
import { Warehouse } from "./warehouse.ts";

export abstract class Tile {
  protected coordinate: Coordinate;

  constructor(coordinate: Coordinate) {
    this.coordinate = coordinate;
  }

  abstract draw(): string;

  canMove(direction: CardinalDirection, warehouse: Warehouse): boolean {
    const nextTile = warehouse.getMapCell(
      this.coordinate.add(Coordinate.fromDirection(direction))
    );

    return nextTile?.canMove(direction, warehouse) ?? true;
  }

  move(direction: CardinalDirection, warehouse: Warehouse): void {
    if (!this.canMove(direction, warehouse)) {
      return;
    }

    const nextCoord = this.coordinate.add(Coordinate.fromDirection(direction));
    const nextTile = warehouse.getMapCell(nextCoord);

    nextTile?.move(direction, warehouse);

    warehouse.setMapCell(this.coordinate, null);
    warehouse.setMapCell(nextCoord, this);
    this.coordinate = nextCoord;
  }
}

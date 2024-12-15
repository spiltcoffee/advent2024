import { Coordinate } from "../../../common/coordinate.ts";
import { CardinalDirection, Direction } from "../../../common/direction.ts";
import { Box } from "./box.ts";
import { Warehouse } from "./warehouse.ts";

export class WideBox extends Box {
  private boxSide: CardinalDirection;
  private otherBox: WideBox;

  constructor(coordinate: Coordinate, boxSide: CardinalDirection) {
    super(coordinate);
    this.boxSide = boxSide;
  }

  static fromCoordinate(coord: Coordinate): [WideBox, WideBox] {
    const leftBox = new WideBox(coord, Direction.WEST);
    const rightBox = new WideBox(
      coord.add(Coordinate.fromDirection(Direction.EAST)),
      Direction.EAST
    );
    leftBox.setOtherBox(rightBox);
    rightBox.setOtherBox(leftBox);
    return [leftBox, rightBox];
  }

  private setOtherBox(otherBox: WideBox) {
    this.otherBox = otherBox;
  }

  private superCanMove(
    direction: CardinalDirection,
    warehouse: Warehouse
  ): boolean {
    return super.canMove(direction, warehouse);
  }

  canMove(direction: CardinalDirection, warehouse: Warehouse): boolean {
    if (
      this.coordinate.y !== this.otherBox.coordinate.y ||
      Math.abs(this.coordinate.x - this.otherBox.coordinate.x) !== 1
    ) {
      // one of us is moving, just return true
      return true;
    }

    const checkOtherBox = direction !== this.boxSide;

    return (
      (!checkOtherBox || this.otherBox.superCanMove(direction, warehouse)) &&
      this.superCanMove(direction, warehouse)
    );
  }

  private superMove(direction: CardinalDirection, warehouse: Warehouse) {
    return super.move(direction, warehouse);
  }

  move(direction: CardinalDirection, warehouse: Warehouse) {
    const moveOtherBox = direction !== this.boxSide;

    if (moveOtherBox) {
      if (!this.otherBox.superCanMove(direction, warehouse)) {
        return;
      }
      this.otherBox.superMove(direction, warehouse);
    }
    this.superMove(direction, warehouse);
  }

  draw(): string {
    return this.coordinate.x < this.otherBox.coordinate.x ? "[" : "]";
  }

  toString(): string {
    return "WideBox";
  }
}

import { Coordinate } from "../../../common/coordinate.ts";
import { CardinalDirection } from "../../../common/direction.ts";
import { Map } from "../../../common/map.ts";
import { Box } from "./box.ts";
import { Robot } from "./robot.ts";
import { Tile } from "./tile.ts";
import { Wall } from "./wall.ts";

export class Warehouse extends Map<Tile> {
  private readonly robot: Robot;
  private readonly boxes: Box[];
  private constructor(warehouse: Tile[][], robot: Robot, boxes: Box[]) {
    super(warehouse);
    if (!robot) {
      throw new Error("Robot not supplied");
    }
    this.robot = robot;
    if (!boxes) {
      throw new Error("Boxes not supplied");
    }
    this.boxes = boxes;
  }

  static fromInput(input: string): Warehouse {
    let robot: Robot;
    const boxes: Box[] = [];
    const warehouse = input.split("\n").map((row, y) =>
      row.split("").map((cell, x) => {
        switch (cell) {
          case ".":
            return null;
          case "#":
            return new Wall(new Coordinate(x, y));
          case "O":
            const box = new Box(new Coordinate(x, y));
            boxes.push(box);
            return box;
          case "@":
            robot = new Robot(new Coordinate(x, y));
            return robot;
          default:
            throw new Error(`Unknown symbol "${cell}"`);
        }
      })
    );
    return new Warehouse(warehouse, robot, boxes);
  }

  moveRobot(direction: CardinalDirection): void {
    this.robot.move(direction, this);
  }

  get gpsTotal() {
    return this.boxes.reduce((total, box) => total + box.gpsCoordinate, 0);
  }
}

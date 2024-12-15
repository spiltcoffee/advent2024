import { Coordinate } from "../../../common/coordinate.ts";
import { CardinalDirection } from "../../../common/direction.ts";
import { Map } from "../../../common/map.ts";
import { Box } from "./box.ts";
import { Robot } from "./robot.ts";
import { Tile } from "./tile.ts";
import { Wall } from "./wall.ts";
import { WideBox } from "./wideBox.ts";

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

  static fromInput(input: string, wide: boolean = false): Warehouse {
    let robot: Robot;
    const boxes: Box[] = [];
    const warehouse = input.split("\n").map((row, y) =>
      row.split("").flatMap((cell, x) => {
        switch (cell) {
          case ".":
            return wide ? [null, null] : null;
          case "#":
            return wide
              ? [
                  new Wall(new Coordinate(x * 2, y)),
                  new Wall(new Coordinate(x * 2 + 1, y))
                ]
              : new Wall(new Coordinate(x, y));
          case "O":
            if (wide) {
              const wideBoxes = WideBox.fromCoordinate(
                new Coordinate(x * 2, y)
              );
              boxes.push(wideBoxes[0]);
              return wideBoxes;
            } else {
              const box = new Box(new Coordinate(x, y));
              boxes.push(box);
              return box;
            }
          case "@":
            robot = new Robot(new Coordinate(wide ? x * 2 : x, y));
            return wide ? [robot, null] : robot;
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

  draw(): string {
    let y = 0;
    let output = "";
    this.forEachMapCell((cell, coord) => {
      if (coord.y > y) {
        output += "\n";
        y++;
      }

      output += cell?.draw() ?? ".";
    });
    return output;
  }

  get gpsTotal() {
    return this.boxes.reduce((total, box) => total + box.gpsCoordinate, 0);
  }
}

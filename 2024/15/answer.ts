import { AnswerFunction } from "../../answer.ts";
import { CardinalDirection, Direction } from "../../common/direction.ts";
import { Warehouse } from "./src/warehouse.ts";

type DirectionChar = "^" | ">" | "v" | "<";
const CHAR_DIRECTION_MAP: Record<DirectionChar, CardinalDirection> = {
  "^": Direction.NORTH,
  ">": Direction.EAST,
  v: Direction.SOUTH,
  "<": Direction.WEST
};

export const answer: AnswerFunction = ([input]) => {
  const [warehouseInput, directionInput] = input.split("\n\n");
  const warehouse = Warehouse.fromInput(warehouseInput);
  const directions = directionInput.split("\n").flatMap((line) =>
    line.split("").map((char: DirectionChar) => {
      const direction = CHAR_DIRECTION_MAP[char];
      if (!direction) {
        throw new Error(`Unknown direction "${char}"`);
      }
      return direction;
    })
  );

  directions.forEach((direction) => warehouse.moveRobot(direction));

  return [warehouse.gpsTotal.toString(), ""];
};

import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Vector } from "../../common/vector.ts";

class Robot {
  private readonly coordinate: Coordinate;
  private readonly vector: Vector;

  private static ROBOT_REGEX = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

  private constructor(coordinate: Coordinate, vector: Vector) {
    this.coordinate = coordinate;
    this.vector = vector;
  }

  static fromInput(input: string): Robot {
    console.log(Robot.ROBOT_REGEX.exec(input));
    const [, px, py, vx, vy] = Robot.ROBOT_REGEX.exec(input);
    return new Robot(
      new Coordinate(Number.parseInt(px, 10), Number.parseInt(py, 10)),
      new Vector(Number.parseInt(vx, 10), Number.parseInt(vy, 10))
    );
  }

  simulatePosition(time: number, limit: Coordinate): Coordinate {
    return this.coordinate.add(this.vector.multiply(time)).wrap(limit);
  }
}

export const answer: AnswerFunction = ([input], type) => {
  const dimensions =
    type === "test" ? new Coordinate(11, 7) : new Coordinate(101, 103);

  const robots = input.split("\n").map(Robot.fromInput);
  console.log(robots);

  return ["", ""];
};

import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Vector } from "../../common/vector.ts";
import { Map } from "../../common/map.ts";
import * as pureimage from "pureimage";
import { createWriteStream } from "fs";

type Quadrant = "1" | "2" | "3" | "4" | null;

class Room extends Map<number> {
  static fromDimensions(dimensions: Coordinate) {
    return new Room(dimensions.x + 1, dimensions.y + 1, 0);
  }
}

const TARGET_DIR = new URL("./target/", import.meta.url);

class Robot {
  private readonly coordinate: Coordinate;
  private readonly vector: Vector;

  private static ROBOT_REGEX = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

  private constructor(coordinate: Coordinate, vector: Vector) {
    this.coordinate = coordinate;
    this.vector = vector;
  }

  static fromInput(input: string): Robot {
    const [, px, py, vx, vy] = Robot.ROBOT_REGEX.exec(input);
    return new Robot(
      new Coordinate(Number.parseInt(px, 10), Number.parseInt(py, 10)),
      new Vector(Number.parseInt(vx, 10), Number.parseInt(vy, 10))
    );
  }

  simulatePosition(time: number, limit: Coordinate): Coordinate {
    return this.coordinate.add(this.vector.multiply(time)).wrap(limit);
  }

  private static identifyQuadrant(
    coordinate: Coordinate,
    dimensions: Coordinate
  ): Quadrant {
    const verticalLine = dimensions.x / 2;
    const horizontalLine = dimensions.y / 2;

    if (coordinate.x < verticalLine) {
      if (coordinate.y < horizontalLine) {
        return "1";
      } else if (coordinate.y > horizontalLine) {
        return "3";
      }
    } else if (coordinate.x > verticalLine) {
      if (coordinate.y < horizontalLine) {
        return "2";
      } else if (coordinate.y > horizontalLine) {
        return "4";
      }
    }
    return null;
  }

  static simulatePositions(
    robots: Robot[],
    dimensions: Coordinate,
    time: number
  ) {
    return robots.map((robot) => robot.simulatePosition(time, dimensions));
  }

  static calculateSafety(
    robots: Robot[],
    dimensions: Coordinate,
    time: number
  ): number {
    return Object.values(
      this.simulatePositions(robots, dimensions, time)
        .map((robot) => Robot.identifyQuadrant(robot, dimensions))
        .filter(Boolean)
        .reduce(
          (quadrants, quadrant) => {
            quadrants[quadrant]++;
            return quadrants;
          },
          { 1: 0, 2: 0, 3: 0, 4: 0 }
        )
    ).reduce((safety, quadrant) => safety * quadrant, 1);
  }

  static async drawRobots(
    robots: Robot[],
    dimensions: Coordinate,
    time: number
  ) {
    const room = Room.fromDimensions(dimensions);
    const coords = this.simulatePositions(robots, dimensions, time);

    coords.forEach((coord) =>
      room.setMapCell(coord, room.getMapCell(coord) + 1)
    );

    const image = pureimage.make(dimensions.x + 1, dimensions.y + 1);
    const ctx = image.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, dimensions.x, dimensions.y);

    room.forEachMapCell((robots: number, coord: Coordinate) => {
      if (robots > 0) {
        ctx.fillPixelWithColor(coord.x, coord.y, 0xffffffff);
      }
    });

    await pureimage.encodePNGToStream(
      image,
      createWriteStream(new URL(`./${time}.png`, TARGET_DIR))
    );
  }
}

export const answer: AnswerFunction = async ([input], type) => {
  // Coordinates are 0 based, so we subtract one from the dimensions in the question
  const dimensions =
    type === "test" ? new Coordinate(10, 6) : new Coordinate(100, 102);

  const robots = input.split("\n").filter(Boolean).map(Robot.fromInput);
  const safetyAfter100s = Robot.calculateSafety(robots, dimensions, 100);

  // if (type === "real") {
  //   const { default: range } = await import("lodash.range");
  //   const { mkdir } = await import("fs/promises");
  //   await mkdir(TARGET_DIR, { recursive: true });
  //   for (const time of range(103 * 101)) {
  //     await Robot.drawRobots(robots, dimensions, time);
  //   }
  // }

  const firstFrame = type === "test" ? NaN : 6888;

  return [safetyAfter100s.toString(), firstFrame.toString()];
};

import { Coordinate } from "./coordinate.ts";
import { TileMap, TileType } from "./tileMap.ts";
import { MarkingMap as MarkingMap } from "./markingMap.ts";
import { BlockageMap } from "./blockageMap.ts";
import { Direction, Heading } from "./heading.ts";

export class Guard {
  private heading: Heading;
  private turns: Heading[];

  private constructor(heading: Heading) {
    this.heading = heading;
    this.turns = [];
  }

  static fromInput(input: string): Guard {
    let guard: Guard;

    input
      .split("\n")
      .some((row, y) =>
        row
          .split("")
          .some((col, x) =>
            col === "^"
              ? (guard = new Guard(
                  new Heading(new Coordinate(x, y), Direction.NORTH)
                ))
              : false
          )
      );

    return guard;
  }

  visitPatrol(map: TileMap): MarkingMap {
    const visitedMap = MarkingMap.fromMap(map);
    const guard = this.clone();
    guard.patrol(map, () => visitedMap.setMapCell(guard.heading.coord, true));
    return visitedMap;
  }

  blockPatrol(map: TileMap): MarkingMap {
    const visitedMap = MarkingMap.fromMap(map);
    const loopBlockageMap = MarkingMap.fromMap(map);

    const guard = this.clone();

    guard.patrol(map, () => {
      visitedMap.setMapCell(guard.heading.coord, true);
      const nextCoord = guard.heading.move().coord;
      if (
        !visitedMap.getMapCell(nextCoord) &&
        map.getMapCell(nextCoord) !== TileType.WALL &&
        map.hasWallInHeading(guard.heading.turn()) !== null
      ) {
        const blockageMap = new BlockageMap(nextCoord, map);
        const blockageGuard = guard.clone();
        try {
          blockageGuard.patrol(blockageMap);
        } catch {
          loopBlockageMap.setMapCell(nextCoord, true);
        }
      }
    });

    return loopBlockageMap;
  }

  private checkLoop() {
    if (this.turns.some((turn) => turn.equals(this.heading))) {
      throw new Error(`Guard is stuck in loop at ${this.heading}`);
    }
    this.turns.push(this.heading);
  }

  private move(map: TileMap) {
    const currentHeading = this.heading;
    this.heading = currentHeading.move();
    if (map.getMapCell(this.heading.coord) === TileType.WALL) {
      this.heading = currentHeading.turn();
      this.checkLoop();
    }
  }

  private patrol(map: TileMap, callback?: () => void) {
    while (map.isMapCell(this.heading.coord)) {
      callback?.();
      this.move(map);
    }
  }

  private clone(): Guard {
    return new Guard(this.heading);
  }
}

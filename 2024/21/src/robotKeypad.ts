import range from "lodash.range";
import { Coordinate } from "../../../common/coordinate.ts";
import { Command } from "./command.ts";
import { Memoize } from "fast-typescript-memoize";

export class RobotKeypad {
  readonly #depth: number;

  static KEYPAD: Record<string, Coordinate> = {
    "7": new Coordinate(0, 0),
    "8": new Coordinate(1, 0),
    "9": new Coordinate(2, 0),

    "4": new Coordinate(0, 1),
    "5": new Coordinate(1, 1),
    "6": new Coordinate(2, 1),

    "1": new Coordinate(0, 2),
    "2": new Coordinate(1, 2),
    "3": new Coordinate(2, 2),

    // todo: can't actually move here
    // blank spot (0,3)
    "0": new Coordinate(1, 3),
    A: new Coordinate(2, 3)
  };

  static DPAD: Record<Command, Coordinate> = {
    // todo: can't actually move here
    // blank spot (0,0)
    [Command.UP]: new Coordinate(1, 0),
    [Command.PRESS]: new Coordinate(2, 0),

    [Command.LEFT]: new Coordinate(0, 1),
    [Command.DOWN]: new Coordinate(1, 1),
    [Command.RIGHT]: new Coordinate(2, 1)
  };

  constructor(depth: number) {
    this.#depth = depth;
  }

  @Memoize((start, end) => `${start}->${end}`)
  buildCommandsFromCoords(start: Coordinate, end: Coordinate): Command[] {
    const { x, y } = end.subtract(start);
    const commands: Command[] = [];
    if (x !== 0) {
      const horizontalCommand = x > 0 ? Command.RIGHT : Command.LEFT;
      commands.push(...range(Math.abs(x)).map(() => horizontalCommand));
    }
    if (y !== 0) {
      const verticalCommand = y > 0 ? Command.DOWN : Command.UP;
      commands.push(...range(Math.abs(y)).map(() => verticalCommand));
    }

    return [...commands, Command.PRESS];
  }

  keypadToCommands(code: string): Command[] {
    return code
      .split("")
      .map((key) => RobotKeypad.KEYPAD[key])
      .flatMap((coord, index, array) =>
        this.buildCommandsFromCoords(
          array[index - 1] ?? RobotKeypad.KEYPAD["A"],
          coord
        )
      );
  }

  commandsToCommands(commands: Command[]): Command[] {
    return commands
      .map((key) => RobotKeypad.DPAD[key])
      .flatMap((coord, index, array) =>
        this.buildCommandsFromCoords(
          array[index - 1] ?? RobotKeypad.DPAD[Command.PRESS],
          coord
        )
      );
  }

  convertCode(code: string, depth: number = this.#depth): Command[] {
    return depth
      ? this.commandsToCommands(this.convertCode(code, depth - 1))
      : this.keypadToCommands(code);
  }

  getComplexity(code: string): number {
    const sequence = this.convertCode(code);
    return Number.parseInt(code, 10) * sequence.length;
  }
}

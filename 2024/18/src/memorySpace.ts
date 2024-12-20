import { Memoize } from "fast-typescript-memoize";
import { Coordinate } from "../../../common/coordinate.ts";
import { DefaultValue, Map } from "../../../common/map.ts";
import { Space } from "./space.ts";

export class MemorySpace extends Map<Space> {
  readonly #remainingBytes: Coordinate[];

  private constructor(
    width: number,
    height: number,
    defaultValue: DefaultValue<Space>,
    remainingBytes: Coordinate[]
  ) {
    super(width, height, defaultValue);
    this.#remainingBytes = remainingBytes;
  }

  static fromInput(input: string, params: string) {
    const [width, height, bytesToSimulate] = params
      .split(",")
      .map((str) => Number.parseInt(str, 10));

    const blockedBytes = input
      .split("\n")
      .map(
        (line) =>
          new Coordinate(
            ...(line.split(",").map((str) => Number.parseInt(str, 10)) as [
              number,
              number
            ])
          )
      );

    const initialBytes = blockedBytes.slice(0, bytesToSimulate);
    const remainingBytes = blockedBytes.slice(bytesToSimulate);

    const endCoordinate = new Coordinate(width, height);

    return new MemorySpace(
      width,
      height,
      (coordinate) =>
        new Space(
          coordinate,
          initialBytes.some((blockedByte) => blockedByte.equals(coordinate)),
          Coordinate.magnitudeBetween(coordinate, endCoordinate)
        ),
      remainingBytes
    );
  }

  private get unblockedSpaces(): Space[] {
    return this.getAllCells().filter((space) => !space.blocked);
  }

  private get startSpace(): Space {
    return this.getMapCell(Coordinate.ORIGIN);
  }

  @Memoize()
  get endSpace(): Space {
    return this.getMapCell(new Coordinate(this.width - 1, this.height - 1));
  }

  sortAndPopClosestSpace(spaces: Space[]): Space {
    spaces.sort((a, b) =>
      Number.isFinite(a.heuristic)
        ? a.heuristic - b.heuristic
        : Number.isFinite(b.heuristic)
          ? 1
          : 0
    );

    const nextSpace = spaces.shift() ?? null;

    if (nextSpace && !Number.isFinite(nextSpace.heuristic)) {
      spaces.unshift(nextSpace);
      return null;
    } else {
      return nextSpace;
    }
  }

  findShortestPath(): void {
    const unvisited = [...this.unblockedSpaces];

    this.startSpace.distance = 0;

    let nextSpace = this.sortAndPopClosestSpace(unvisited);
    while (nextSpace && nextSpace !== this.endSpace) {
      nextSpace.visitNeighbours(this);
      nextSpace = this.sortAndPopClosestSpace(unvisited);
    }
  }

  resetPaths(): void {
    this.getAllCells().forEach((space) => {
      space.distance = Infinity;
      space.parent = null;
    });
  }

  findFirstBlockingByte(): Coordinate {
    this.findShortestPath();
    let nextByte: Coordinate;
    do {
      nextByte = this.#remainingBytes.shift();
      this.getMapCell(nextByte).blocked = true;
      this.resetPaths();
      this.findShortestPath();
    } while (Number.isFinite(this.endSpace.distance));
    return nextByte;
  }
}

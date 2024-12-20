import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { MemorySpace } from "./memorySpace.ts";

export class Space {
  readonly #coordinate: Coordinate;
  #blocked: boolean = false;
  #distance: number = Infinity;
  #parent: Space = null;

  static readonly NEIGHBOUR_COORDS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST
  ].map(Coordinate.fromDirection);

  constructor(coordinate: Coordinate, blocked: boolean) {
    this.#coordinate = coordinate;
    this.#blocked = blocked;
  }

  get blocked(): boolean {
    return this.#blocked;
  }

  set blocked(blocked: boolean) {
    this.#blocked = blocked;
  }

  get distance(): number {
    return this.#distance;
  }

  set distance(distance: number) {
    this.#distance = distance;
  }

  get parent(): Space {
    return this.#parent;
  }

  set parent(parent: Space) {
    this.#parent = parent;
  }

  visitNeighbours(map: MemorySpace): void {
    map
      .getMapCells(
        Space.NEIGHBOUR_COORDS.map((coordinate) =>
          coordinate.add(this.#coordinate)
        )
      )
      .filter((space) => !space.blocked)
      .forEach((neighbour) => {
        const distance = this.distance + 1;
        if (distance < neighbour.distance) {
          neighbour.distance = distance;
          neighbour.parent = this;
        }
      });
  }
}

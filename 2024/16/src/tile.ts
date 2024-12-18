import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { TileMap } from "./tileMap.ts";

class Path {
  distance: number;
  direction: Direction;
  parent: Tile;

  constructor(distance: number, direction: Direction, parent: Tile) {
    this.distance = distance;
    this.direction = direction;
    this.parent = parent;
  }
}

export abstract class Tile {
  readonly #coordinate: Coordinate;
  protected readonly paths: Path[] = [];

  static readonly NEIGHBOUR_COORDS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST
  ].map(Coordinate.fromDirection);

  constructor(coordinate: Coordinate) {
    this.#coordinate = coordinate;
  }

  get coordinate(): Coordinate {
    return this.#coordinate;
  }

  get movable(): boolean {
    return true;
  }

  get distance(): number {
    return this.paths.at(0)?.distance ?? Infinity;
  }

  get direction(): Direction {
    return this.paths.at(0)?.direction ?? null;
  }

  get parent(): Tile {
    return this.paths.at(0)?.parent ?? null;
  }

  addPath(distance: number, direction: Direction, parent: Tile): boolean {
    const existing = this.paths.find(
      (otherPath) => direction === otherPath.direction
    );

    try {
      if (!existing) {
        this.paths.push(new Path(distance, direction, parent));
        return true;
      } else if (distance < existing.distance) {
        existing.distance = distance;
      }
      return false;
    } finally {
      this.paths.sort((a, b) => a.distance - b.distance);
    }
  }

  getShortestPaths(nextTile: Tile): Tile[][] {
    if (!this.paths.length) {
      throw new Error(`Paths are not defined for ${this}`);
    }

    let shortestPaths: Path[];

    if (!nextTile) {
      shortestPaths = this.paths.filter(
        ({ distance }) => distance === this.distance
      );
    } else {
      const toDirection = this.directionTo(nextTile);
      const nextPaths = this.paths
        .filter((path) => path.parent !== nextTile)
        .map((path) => ({
          nextDistance:
            path.distance + (path.direction === toDirection ? 1 : 1001),
          path
        }))
        .toSorted((a, b) => a.nextDistance - b.nextDistance);

      const shortestNextDistance = nextPaths.at(0)?.nextDistance || Infinity;
      shortestPaths = nextPaths
        .filter(({ nextDistance }) => shortestNextDistance === nextDistance)
        .map(({ path }) => path);
    }

    return shortestPaths
      .flatMap(({ parent }) => parent.getShortestPaths(this))
      .map((path) => path.concat(this));
  }

  distanceTo(otherTile: Tile): number {
    return this.paths
      .map(
        (path) =>
          path.distance +
          (path.direction === this.directionTo(otherTile) ? 1 : 1001)
      )
      .sort()
      .at(0);
  }

  directionTo(otherTile: Tile): Direction {
    return this.#coordinate.directionTo(otherTile.#coordinate);
  }

  visitNeighbours(map: TileMap, unvisited: Tile[]): void {
    map
      .getMapCells(
        Tile.NEIGHBOUR_COORDS.map((coord) => coord.add(this.#coordinate))
      )
      .filter((tile) => tile.movable && tile.paths.length <= 3)
      .forEach((neighbour) => {
        if (
          !neighbour.addPath(
            this.distanceTo(neighbour),
            this.directionTo(neighbour),
            this
          )
        ) {
          return;
        }

        if (!unvisited.includes(neighbour)) {
          neighbour.visitNeighbours(map, unvisited);
        }
      });
  }

  toString(): string {
    return `${this.constructor.name}${this.#coordinate}${this.paths
      .map(({ distance }) => distance)
      .sort()
      .join(",")}`;
  }
}

import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { RaceTrack } from "./raceTrack.ts";

export class Tile {
  readonly #coordinate: Coordinate;
  #distance: number = Infinity;

  static readonly NEIGHBOUR_COORDS = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST
  ].map(Coordinate.fromDirection);

  constructor(coordinate: Coordinate) {
    this.#coordinate = coordinate;
  }

  get distance(): number {
    return this.#distance;
  }

  set distance(distance: number) {
    this.#distance = distance;
  }

  get movable(): boolean {
    return true;
  }

  get coordinate(): Coordinate {
    return this.#coordinate;
  }

  getNextTile(raceTrack: RaceTrack): Tile {
    return raceTrack
      .getMapCells(
        Tile.NEIGHBOUR_COORDS.map((coordinate) =>
          coordinate.add(this.#coordinate)
        )
      )
      .find(
        (neighbour) => neighbour.movable && neighbour.distance > this.distance
      );
  }

  getTotalCheatsAtOrAbove(
    map: RaceTrack,
    tilesToScan: Coordinate[],
    minimumCheat: number
  ): number[] {
    const cheats = map
      .getMapCells(
        tilesToScan.map((tileToScan) => tileToScan.add(this.#coordinate))
      )
      .filter((otherTile) => otherTile.movable)
      .map((otherTile) => {
        return {
          otherTile,
          cheat:
            Math.abs(this.distance - otherTile.distance) -
            Coordinate.taxicabBetween(this.#coordinate, otherTile.#coordinate)
        };
      })
      .filter(({ cheat }) => cheat >= minimumCheat)
      .map(({ cheat }) => cheat);

    return cheats;
  }
}

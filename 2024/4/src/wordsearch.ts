import range from "lodash.range";
import { Coordinate } from "../../../common/coordinate.ts";
import { Direction } from "../../../common/direction.ts";
import { Map } from "../../../common/map.ts";

const XMAS_VECTORS = [
  Direction.NORTH_EAST,
  Direction.EAST,
  Direction.SOUTH_EAST,
  Direction.SOUTH
].map(Coordinate.fromDirection);

const MAS_CROSS_VECTORS = [
  Direction.NORTH_EAST,
  Direction.SOUTH_EAST,
  Direction.SOUTH_WEST,
  Direction.NORTH_WEST
].map(Coordinate.fromDirection);

export class WordSearch extends Map<string> {
  static fromInput(input: string): WordSearch {
    return new WordSearch(
      input
        .split("\n")
        .filter(Boolean)
        .map((row) => row.split(""))
    );
  }

  map<T>(callback: (coord: Coordinate) => T): T[] {
    return range(this.height).flatMap((y) =>
      range(this.width).flatMap((x) => callback(new Coordinate(x, y)))
    );
  }

  private coordsToString(coords: Coordinate[]): string {
    return this.getMapCells(coords).filter(Boolean).join("");
  }

  findXmasLine(
    startCoord: Coordinate
  ): Array<{ coords: Coordinate[] } | false> {
    if (["M", "A"].includes(this.getMapCell(startCoord))) {
      return [];
    }

    return XMAS_VECTORS.map((vector) => {
      const coords = range(3).reduce(
        (coords) => [...coords, coords.at(-1).add(vector)],
        [startCoord]
      );
      return ["XMAS", "SAMX"].includes(this.coordsToString(coords))
        ? { coords }
        : false;
    });
  }

  findMasCross(startCoord: Coordinate): { coords: Coordinate[] } | false {
    if (this.getMapCell(startCoord) !== "A") {
      return false;
    }

    const coords = MAS_CROSS_VECTORS.map((crossCoord) =>
      startCoord.add(crossCoord)
    );

    return ["MSSM", "MMSS", "SMMS", "SSMM"].includes(
      this.coordsToString(coords)
    )
      ? { coords }
      : false;
  }
}

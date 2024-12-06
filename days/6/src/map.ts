import type { Coordinate } from "./coordinate.ts";

export class Map<T> {
  protected readonly map: T[][];
  readonly width: number;
  readonly height: number;

  protected constructor(map: T[][]) {
    this.map = map;
    this.width = this.map[0].length;
    this.height = this.map.length;
  }

  getMapCell(coord: Coordinate): T | null {
    return this.isMapCell(coord) ? this.map[coord.y][coord.x] : null;
  }

  setMapCell(coord: Coordinate, value: T) {
    if (this.isMapCell(coord)) {
      this.map[coord.y][coord.x] = value;
    }
  }

  isMapCell(coord: Coordinate): boolean {
    return (
      coord.x >= 0 &&
      coord.x < this.width &&
      coord.y >= 0 &&
      coord.y < this.height
    );
  }
}

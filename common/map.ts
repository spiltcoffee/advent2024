import range from "lodash.range";
import { Coordinate } from "./coordinate.ts";

type DefaultValue<T> = T | ((coordinate: Coordinate) => T);

export class Map<T> {
  readonly #map: T[][];
  readonly width: number;
  readonly height: number;

  protected constructor(map: T[][]);
  protected constructor(
    width: number,
    height: number,
    defaultValue?: DefaultValue<T>
  );
  protected constructor(map: Map<unknown>, defaultValue?: DefaultValue<T>);
  protected constructor(
    mapOrWidth: T[][] | Map<unknown> | number,
    heightOrDefaultValue?: number | DefaultValue<T>,
    maybeDefaultValue?: DefaultValue<T>
  ) {
    if (Array.isArray(mapOrWidth)) {
      this.#map = mapOrWidth;
      this.width = this.#map[0].length;
      this.height = this.#map.length;
    } else {
      let defaultValue: DefaultValue<T>;
      if (mapOrWidth instanceof Map) {
        this.width = mapOrWidth.width;
        this.height = mapOrWidth.height;
        defaultValue = <DefaultValue<T>>heightOrDefaultValue;
      } else {
        this.width = mapOrWidth;
        this.height = <number>heightOrDefaultValue;
        defaultValue = maybeDefaultValue;
      }

      this.#map = range(this.height).map((y) =>
        range(this.width).map((x) =>
          defaultValue instanceof Function
            ? defaultValue(new Coordinate(x, y))
            : defaultValue
        )
      );
    }
  }

  getMapCell(coord: Coordinate): T | null {
    return this.isMapCell(coord) ? this.#map[coord.y][coord.x] : null;
  }

  getMapCells(coords: Coordinate[]): Array<T | null> {
    return coords
      .filter((coord) => this.isMapCell(coord))
      .map((coord) => this.#map[coord.y][coord.x]);
  }

  getAllCells(): Array<T> {
    return this.#map.flatMap((row) => row);
  }

  setMapCell(coord: Coordinate, value: T): void {
    if (this.isMapCell(coord)) {
      this.#map[coord.y][coord.x] = value;
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

  forEachMapCell(callback: (cell: T, coord: Coordinate) => void) {
    this.#map.forEach((row, y) =>
      row.forEach((cell, x) => callback(cell, new Coordinate(x, y)))
    );
  }
}

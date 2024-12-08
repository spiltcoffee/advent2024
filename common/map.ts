import range from "lodash.range";
import type { Coordinate } from "./coordinate.ts";

type DefaultValue<T> = T | (() => T);

export class Map<T> {
  protected readonly map: T[][];
  readonly width: number;
  readonly height: number;

  protected constructor(map: T[][]);
  protected constructor(
    width: number,
    height: number,
    defaultValue?: T | (() => T)
  );
  protected constructor(map: Map<unknown>, defaultValue?: T | (() => T));
  protected constructor(
    mapOrWidth: T[][] | Map<unknown> | number,
    heightOrDefaultValue?: number | DefaultValue<T>,
    maybeDefaultValue?: DefaultValue<T>
  ) {
    if (Array.isArray(mapOrWidth)) {
      this.map = mapOrWidth;
      this.width = this.map[0].length;
      this.height = this.map.length;
    } else {
      let defaultValue: T | (() => T);
      if (mapOrWidth instanceof Map) {
        this.width = mapOrWidth.width;
        this.height = mapOrWidth.height;
        defaultValue = <DefaultValue<T>>heightOrDefaultValue;
      } else {
        this.width = mapOrWidth;
        this.height = <number>heightOrDefaultValue;
        defaultValue = maybeDefaultValue;
      }

      this.map = range(this.height).map(() =>
        range(this.width).map(() =>
          defaultValue instanceof Function ? defaultValue() : defaultValue
        )
      );
    }
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

import { Map } from "../../../common/map.ts";

export class AntinodeMap extends Map<boolean> {
  static fromDimensions(width: number, height: number): AntinodeMap {
    return new AntinodeMap(width, height, false);
  }

  static fromMap(map: Map<unknown>): AntinodeMap {
    return new AntinodeMap(map, false);
  }

  get count(): number {
    return this.getAllCells().filter(Boolean).length;
  }
}

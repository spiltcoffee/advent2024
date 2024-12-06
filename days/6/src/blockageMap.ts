import { Coordinate } from "./coordinate.ts";
import { TileMap, TileType } from "./tileMap.ts";

export class BlockageMap extends TileMap {
  private blockage: Coordinate;
  private underlyingMap: TileMap;

  constructor(blockage: Coordinate, underlyingMap: TileMap) {
    super([[]]);
    this.blockage = blockage;
    this.underlyingMap = underlyingMap;
  }

  isMapCell(coord: Coordinate): boolean {
    return this.underlyingMap.isMapCell(coord);
  }

  getMapCell(coord: Coordinate): TileType {
    if (coord.equals(this.blockage)) {
      return TileType.WALL;
    }

    return this.underlyingMap.getMapCell(coord);
  }
}

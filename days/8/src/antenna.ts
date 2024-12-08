import { Coordinate } from "../../../common/coordinate.ts";
import { AntinodeMap } from "./antinodeMap.ts";

export class Antenna {
  readonly coord: Coordinate;
  readonly freq: string;

  constructor(coord: Coordinate, freq: string) {
    this.coord = coord;
    this.freq = freq;
  }

  markSimpleAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = this.coord.vectorToCoord(otherAntenna.coord);
    [
      otherAntenna.coord.add(vector),
      this.coord.add(vector.inverseVector())
    ].forEach((antinode) => antinodeMap.setMapCell(antinode, true));
  }

  markAdvancedAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = this.coord.vectorToCoord(otherAntenna.coord);
    let nextCoord = otherAntenna.coord;
    while (antinodeMap.isMapCell(nextCoord)) {
      antinodeMap.setMapCell(nextCoord, true);
      nextCoord = nextCoord.add(vector);
    }

    const inverseVector = vector.inverseVector();

    nextCoord = this.coord;
    while (antinodeMap.isMapCell(nextCoord)) {
      antinodeMap.setMapCell(nextCoord, true);
      nextCoord = nextCoord.add(inverseVector);
    }
  }
}

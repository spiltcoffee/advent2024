import { Coordinate } from "../../../common/coordinate.ts";
import { Vector } from "../../../common/vector.ts";
import { AntinodeMap } from "./antinodeMap.ts";

export class Antenna {
  readonly coord: Coordinate;
  readonly freq: string;

  constructor(coord: Coordinate, freq: string) {
    this.coord = coord;
    this.freq = freq;
  }

  markSimpleAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = Vector.fromCoordToCoord(this.coord, otherAntenna.coord);
    [otherAntenna.coord.add(vector), this.coord.add(vector.inverse())].forEach(
      (antinode) => antinodeMap.setMapCell(antinode, true)
    );
  }

  markAdvancedAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = Vector.fromCoordToCoord(this.coord, otherAntenna.coord);
    let nextCoord = otherAntenna.coord;
    while (antinodeMap.isMapCell(nextCoord)) {
      antinodeMap.setMapCell(nextCoord, true);
      nextCoord = nextCoord.add(vector);
    }

    const inverseVector = vector.inverse();

    nextCoord = this.coord;
    while (antinodeMap.isMapCell(nextCoord)) {
      antinodeMap.setMapCell(nextCoord, true);
      nextCoord = nextCoord.add(inverseVector);
    }
  }
}

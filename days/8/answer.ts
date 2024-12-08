import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Map } from "../../common/map.ts";

class Antenna {
  readonly coord: Coordinate;
  readonly freq: string;

  constructor(coord: Coordinate, freq: string) {
    this.coord = coord;
    this.freq = freq;
  }

  markSimpleAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = this.coord.vectorTo(otherAntenna.coord);
    [
      otherAntenna.coord.add(vector),
      this.coord.add(vector.inverseVector())
    ].forEach((antinode) => antinodeMap.setMapCell(antinode, true));
  }

  markAdvancedAntinodes(otherAntenna: Antenna, antinodeMap: AntinodeMap): void {
    const vector = this.coord.vectorTo(otherAntenna.coord);
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

class AntinodeMap extends Map<boolean> {
  static fromDimensions(width: number, height: number): AntinodeMap {
    return new AntinodeMap(width, height, false);
  }

  static fromMap(map: Map<unknown>): AntinodeMap {
    return new AntinodeMap(map, false);
  }

  get count(): number {
    return this.map.flatMap((row) => row).filter(Boolean).length;
  }
}

export const answer: AnswerFunction = ([input]) => {
  const lines = input.split("\n").filter(Boolean);
  const simpleMap = AntinodeMap.fromDimensions(lines[0].length, lines.length);
  const advancedMap = AntinodeMap.fromMap(simpleMap);

  const antennas = lines
    .flatMap((row, y) =>
      row.split("").map((col, x) => {
        if (col === ".") {
          return null;
        }

        return new Antenna(new Coordinate(x, y), col);
      })
    )
    .filter(Boolean);

  new Set(antennas.map(({ freq }) => freq)).forEach((currFreq) => {
    const matchingAntennas = antennas.filter(({ freq }) => freq === currFreq);
    while (matchingAntennas.length) {
      const currentAntenna = matchingAntennas.shift();
      matchingAntennas.forEach((matchingAntenna) => {
        currentAntenna.markSimpleAntinodes(matchingAntenna, simpleMap);
        currentAntenna.markAdvancedAntinodes(matchingAntenna, advancedMap);
      });
    }
  });

  const simpleAntinodes = simpleMap.count;
  const advancedAnitnodes = advancedMap.count;

  return [simpleAntinodes.toString(), advancedAnitnodes.toString()];
};

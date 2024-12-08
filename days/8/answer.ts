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

  findAntinodes(otherAntenna: Antenna): [Coordinate, Coordinate] {
    return [
      this.coord.add(otherAntenna.coord.vectorTo(this.coord)),
      otherAntenna.coord.add(this.coord.vectorTo(otherAntenna.coord))
    ];
  }
}

class AntinodeMap extends Map<boolean> {
  constructor(width: number, height: number) {
    super(width, height, false);
  }

  get count(): number {
    return this.map.flatMap((row) => row).filter(Boolean).length;
  }
}

export const answer: AnswerFunction = ([input]) => {
  const lines = input.split("\n").filter(Boolean);
  const antinodeMap = new AntinodeMap(lines[0].length, lines.length);

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
      matchingAntennas.forEach((matchingAntenna) =>
        currentAntenna
          .findAntinodes(matchingAntenna)
          .forEach((antinode) => antinodeMap.setMapCell(antinode, true))
      );
    }
  });

  const uniqueAntinodes = antinodeMap.count;

  return [uniqueAntinodes.toString(), ""];
};

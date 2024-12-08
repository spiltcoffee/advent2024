import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Antenna } from "./src/antenna.ts";
import { AntinodeMap } from "./src/antinodeMap.ts";

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

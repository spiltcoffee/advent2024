import { AnswerFunction } from "../../answer.ts";
import { RaceTrack } from "./src/raceTrack.ts";

export const answer: AnswerFunction = ([input, params]) => {
  const raceTrack = RaceTrack.fromInput(input);
  const [part1Params, part2Params] = params.split("\n").map(line => line.split(",").map(param => Number.parseInt(param, 10)) as [number, number]);
  const part1TotalCheats = raceTrack.getTotalCheatsAtOrAbove(...part1Params);
  const part2TotalCheats = raceTrack.getTotalCheatsAtOrAbove(...part2Params);
  return [part1TotalCheats.toString(), part2TotalCheats.toString()];
};

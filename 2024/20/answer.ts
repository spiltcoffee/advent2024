import { AnswerFunction } from "../../answer.ts";
import { RaceTrack } from "./src/raceTrack.ts";

export const answer: AnswerFunction = ([input, param]) => {
  const raceTrack = RaceTrack.fromInput(input);
  const minimumCheat = Number.parseInt(param, 10);
  const totalCheats = raceTrack.getTotalCheatsAtOrAbove(minimumCheat);
  return [totalCheats.toString(), ""];
};

import { AnswerFunction } from "../../answer.ts";
import { HikingMap } from "./src/hikingMap.ts";

export const answer: AnswerFunction = ([input]) => {
  const hikingMap = HikingMap.fromInput(input);
  hikingMap.linkTrails();
  const trailHeadScores = hikingMap.getTrailHeadScores();
  const { trailEnds, distinctTrailEnds } = trailHeadScores.reduce(
    (total, scores) => ({
      trailEnds: total.trailEnds + scores.trailEnds,
      distinctTrailEnds: total.distinctTrailEnds + scores.distinctTrailEnds
    }),
    { trailEnds: 0, distinctTrailEnds: 0 }
  );
  return [trailEnds.toString(), distinctTrailEnds.toString()];
};

import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const games = input.split("\n").map((game) => game.split(" "));

  const TRANSLATE_HAND: Record<string, string> = { A: "R", B: "P", C: "S" };
  const TRANSLATE_MISUNDERSTANDING: Record<string, string> = {
    X: "A",
    Y: "B",
    Z: "C"
  };
  const TRANSLATE_OUTCOME: Record<string, string> = { X: "W", Y: "D", Z: "L" };

  const HAND_SCORE: Record<string, number> = { R: 1, P: 2, S: 3 };

  const OUTCOME_SCORE: Record<string, Record<string, number>> = {
    R: { R: 3, P: 6, S: 0 },
    P: { R: 0, P: 3, S: 6 },
    S: { R: 6, P: 0, S: 3 }
  };

  const OUTCOME_STRATEGY: Record<string, Record<string, string>> = {
    R: { W: "S", D: "R", L: "P" },
    P: { W: "R", D: "P", L: "S" },
    S: { W: "P", D: "S", L: "R" }
  };

  const scoresMisunderstanding = games.map(([theirs, ours]) => {
    const theirHand = TRANSLATE_HAND[theirs];
    const ourHand = TRANSLATE_HAND[TRANSLATE_MISUNDERSTANDING[ours]];

    const handScore = HAND_SCORE[ourHand];
    const outcomeScore = OUTCOME_SCORE[theirHand][ourHand];
    return handScore + outcomeScore;
  });

  const scoresEpiphany = games.map(([theirs, ours]) => {
    const theirHand = TRANSLATE_HAND[theirs];
    const ourOutcome = TRANSLATE_OUTCOME[ours];

    const ourHand = OUTCOME_STRATEGY[theirHand][ourOutcome];
    const handScore = HAND_SCORE[ourHand];
    const outcomeScore = OUTCOME_SCORE[theirHand][ourHand];
    return handScore + outcomeScore;
  });

  const totalMisunderstanding = scoresMisunderstanding.reduce(
    (a, b) => a + b,
    0
  );
  const totalEpiphany = scoresEpiphany.reduce((a, b) => a + b, 0);

  return [totalMisunderstanding.toString(), totalEpiphany.toString()];
};

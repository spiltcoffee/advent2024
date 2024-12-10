import { AnswerFunction } from "../../answer.ts";
import { WordSearch } from "./src/wordsearch.ts";

export const answer: AnswerFunction = ([input]) => {
  const wordsearch = WordSearch.fromInput(input);

  const xmasLineFinds = wordsearch
    .map((currentCoord) => wordsearch.findXmasLine(currentCoord))
    .filter(Boolean).length;

  const maxCrossFinds = wordsearch
    .map((currentCoord) => wordsearch.findMasCross(currentCoord))
    .filter(Boolean).length;

  return [xmasLineFinds.toString(), maxCrossFinds.toString()];
};

import { AnswerFunction } from "../../answer.ts";
import { Onsen } from "./src/onsen.ts";

export const answer: AnswerFunction = ([input]) => {
  const onsen = Onsen.fromInput(input);
  return [onsen.validPatterns.toString(), ""];
};

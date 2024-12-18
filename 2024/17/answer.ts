import { AnswerFunction } from "../../answer.ts";
import { Program } from "./src/program.ts";

export const answer: AnswerFunction = ([input]) => {
  const program = Program.fromInput(input);
  program.compute();
  return [program.output, ""];
};

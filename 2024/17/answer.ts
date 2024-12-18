import { AnswerFunction } from "../../answer.ts";
import { Program } from "./src/program.ts";

export const answer: AnswerFunction = async ([input]) => {
  const program = Program.fromInput(input);

  return [
    program.compute().output.join(),
    program.findSelfReferencingA().toString()
  ];
};

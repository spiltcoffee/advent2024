import { AnswerFunction } from "../../answer.ts";
import { MemorySpace } from "./src/memorySpace.ts";

export const answer: AnswerFunction = ([input, params]) => {
  const memorySpace = MemorySpace.fromInput(input, params);
  memorySpace.findShortestPath();
  return [memorySpace.endSpace.distance.toString(), ""];
};

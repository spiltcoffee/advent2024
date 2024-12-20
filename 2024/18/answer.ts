import { AnswerFunction } from "../../answer.ts";
import { MemorySpace } from "./src/memorySpace.ts";

export const answer: AnswerFunction = ([input, params]) => {
  const memorySpacePart1 = MemorySpace.fromInput(input, params);
  memorySpacePart1.findShortestPath();

  const memorySpacePart2 = MemorySpace.fromInput(input, params);
  const firstBlockingByte = memorySpacePart2.findFirstBlockingByte();
  return [
    memorySpacePart1.endSpace.distance.toString(),
    firstBlockingByte.toString()
  ];
};

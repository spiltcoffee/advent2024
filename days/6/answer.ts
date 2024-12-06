import { AnswerFunction } from "../../answer.ts";
import { TileMap } from "./src/tileMap.ts";
import { Guard } from "./src/guard.ts";

export const answer: AnswerFunction = ([input]) => {
  const map = TileMap.fromInput(input);
  const guard = Guard.fromInput(input);

  const { count: cellsVisited } = guard.visitPatrol(map);
  const { count: cellsBlocked } = guard.blockPatrol(map);

  return [cellsVisited.toString(), cellsBlocked.toString()];
};

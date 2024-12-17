import { AnswerFunction } from "../../answer.ts";
import { TileMap } from "./src/tileMap.ts";

export const answer: AnswerFunction = async ([input], type) => {
  const map = TileMap.fromInput(input);
  map.findShortestPath();
  // await map.draw(type);
  return [map.endTile.distance.toString(), ""];
};

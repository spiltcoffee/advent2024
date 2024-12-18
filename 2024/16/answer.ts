import { AnswerFunction } from "../../answer.ts";
import { TileMap } from "./src/tileMap.ts";

export const answer: AnswerFunction = async ([input] /*, type*/) => {
  const map = TileMap.fromInput(input);

  map.findShortestPaths();

  // await map.draw(type);

  const shortestDistance = map.endTile.distance;

  const shortestPaths = new Set(
    map.endTile.getShortestPaths().flatMap((path) => path)
  );

  return [shortestDistance.toString(), shortestPaths.size.toString()];
};

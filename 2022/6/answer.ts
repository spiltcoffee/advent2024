import { AnswerFunction } from "../../answer.ts";

function indexOfMarker(input: string, markerLen: number) {
  for (let i = markerLen; i < input.length; i++) {
    const uniqueCharsCount = new Set(input.slice(i - markerLen, i).split(""))
      .size;

    if (uniqueCharsCount === markerLen) {
      return i;
    }
  }
}

export const answer: AnswerFunction = ([input]) => {
  const lines = input.split("\n");
  const packetMarkers = lines.map((line) => indexOfMarker(line, 4)).join("");
  const messageMarkers = lines.map((line) => indexOfMarker(line, 14)).join("");
  return [packetMarkers, messageMarkers];
};

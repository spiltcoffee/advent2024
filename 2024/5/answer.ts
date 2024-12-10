import { AnswerFunction } from "../../answer.ts";
import { PageGraph } from "./src/pageGraph.ts";
import { Update } from "./src/update.ts";

export const answer: AnswerFunction = ([input]) => {
  const [pageRules, updates] = input
    .split("\n\n")
    .filter(Boolean)
    .map((part) => part.trim());

  const pageGraph = PageGraph.parsePageRules(pageRules);

  const { validUpdates, invalidUpdates } = updates
    .split("\n")
    .map((updateStr) => Update.parseUpdate(updateStr, pageGraph))
    .reduce<{ validUpdates: Update[]; invalidUpdates: Update[] }>(
      ({ validUpdates, invalidUpdates }, update) => {
        (update.isValid() ? validUpdates : invalidUpdates).push(update);
        return { validUpdates, invalidUpdates };
      },
      { validUpdates: [], invalidUpdates: [] }
    );

  const validUpdatesMidPageTotal = validUpdates.reduce(
    (total, update) => total + update.middlePage.pageNum,
    0
  );

  const invalidUpdatesMidPageTotal = invalidUpdates
    .map((update) => update.fixUpdate())
    .reduce((total, update) => total + update.middlePage?.pageNum, 0);

  return [
    validUpdatesMidPageTotal.toString(),
    invalidUpdatesMidPageTotal.toString()
  ];
};

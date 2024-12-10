import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const elves = input.split("\n\n");
  const elvesCalories = elves.map((elf) =>
    elf
      .split("\n")
      .map((calories) => Number(calories))
      .reduce((cur, total) => cur + total, 0)
  );

  const topCalories = Math.max(...elvesCalories);
  let topThree = 0;

  for (let i = 0; i < 3; i++) {
    const maxCalories = Math.max(...elvesCalories);
    const maxElf = elvesCalories.indexOf(maxCalories);
    topThree += maxCalories;
    elvesCalories[maxElf] = 0;
  }

  return [topCalories.toString(), topThree.toString()];
};

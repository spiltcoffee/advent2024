import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const rucksacks = input.split("\n").map((rucksack) => {
    const compartmentSize = rucksack.length / 2;
    const left = rucksack.slice(0, compartmentSize);
    const right = rucksack.slice(compartmentSize, rucksack.length);
    return { all: rucksack, left, right };
  });

  const rucksackDuplicates = rucksacks.map(({ left, right }) =>
    left.split("").find((item) => right.includes(item))
  );

  const rucksackGroups = Array.from({ length: rucksacks.length / 3 }, (el, i) =>
    rucksacks.slice(i * 3, i * 3 + 3)
  );

  const rucksackGroupItems = rucksackGroups.map((rucksacks) =>
    rucksacks[0].all
      .split("")
      .find(
        (item) =>
          rucksacks[1].all.includes(item) && rucksacks[2].all.includes(item)
      )
  );
  const rucksackPriority =
    " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const rucksackPriorities = rucksackDuplicates.map((item) =>
    rucksackPriority.indexOf(item)
  );

  const rucksackGroupItemPriorities = rucksackGroupItems.map((item) =>
    rucksackPriority.indexOf(item)
  );

  const prioritiesTotal = rucksackPriorities.reduce((a, b) => a + b, 0);
  const groupItemPrioritiesTotal = rucksackGroupItemPriorities.reduce(
    (a, b) => a + b,
    0
  );

  return [prioritiesTotal.toString(), groupItemPrioritiesTotal.toString()];
};

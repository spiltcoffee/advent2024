import { AnswerFunction } from "../../answer.ts";

function normalize(left, right) {
  if (typeof left === typeof right) {
    return [left, right];
  } else if (typeof left === "number") {
    return [[left], right];
  } else {
    return [left, [right]];
  }
}

function compare(...parts: Array<Array<unknown> | string>) {
  const [left, right] = parts;
  let comp = 0;
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    comp = 0;
    const [curLeft, curRight] = normalize(left[i], right[i]);
    if (Array.isArray(curLeft)) {
      comp = compare(curLeft, curRight);
    } else {
      comp = Math.sign(curLeft - curRight);
    }
    if (comp) {
      break;
    }
  }

  return comp ? comp : Math.sign(left.length - right.length);
}

export const answer: AnswerFunction = ([input]) => {
  const pairs = input.split("\n\n").map((pair) => {
    const [leftInput, rightInput] = pair.split("\n");
    const left = JSON.parse(leftInput);
    const right = JSON.parse(rightInput);

    return [left, right];
  });

  const comparedPairs = pairs.map((pair) => compare(...pair));

  const divider2 = [[2]];
  const divider6 = [[6]];

  const sumOfOrderedIndicies = comparedPairs.reduce(
    (total, sort, index) => total + (sort === -1 ? index + 1 : 0),
    0
  );

  const sortedPackets = pairs
    .flatMap((pair) => pair)
    .concat([divider2, divider6])
    .sort(compare);

  const divider2IndexOf = sortedPackets.findIndex(
    (packet) => packet === divider2
  );
  const divider6IndexOf = sortedPackets.findIndex(
    (packet) => packet === divider6
  );

  const decoderKey = (divider2IndexOf + 1) * (divider6IndexOf + 1);

  return [sumOfOrderedIndicies.toString(), decoderKey.toString()];
};

import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

const PRUNE_BY = 2 ** 24 - 1;

function mixAndPrune(s: number): number {
  s = (s ^ (s << 6)) & PRUNE_BY;
  s = (s ^ (s >> 5)) & PRUNE_BY;
  return (s ^ (s << 11)) & PRUNE_BY;
}

export const answer: AnswerFunction = ([input]) => {
  const initialSecrets = input
    .split("\n")
    .map((str) => Number.parseInt(str, 10));

  const secretsTotalAfter2000 = initialSecrets
    .map((secret) => range(2000).reduce(mixAndPrune, secret))
    .reduce((total, secret) => total + secret, 0);

  const sequenceTally = initialSecrets.reduce<Record<string, number>>(
    (tally, secret) => {
      const found = new Set<string>();
      let lastBananas = secret % 10;
      let diffSequence = [];
      range(2000).reduce((secret) => {
        secret = mixAndPrune(secret);

        const bananas = secret % 10;
        const diff = bananas - lastBananas;
        if (!Number.isNaN(diff)) {
          diffSequence.push(diff);
          if (diffSequence.length === 4) {
            const seqId = diffSequence.join();
            if (!found.has(seqId)) {
              tally[seqId] ||= 0;
              tally[seqId] += bananas;
              found.add(seqId);
            }
            diffSequence = diffSequence.slice(1);
          }
        }

        lastBananas = bananas;
        return secret;
      }, secret);

      return tally;
    },
    {}
  );

  // console.log(sequenceTally);
  const bestBananas = Object.values(sequenceTally)
    .sort((a, b) => b - a)
    .at(0);

  return [secretsTotalAfter2000.toString(), bestBananas.toString()];
};

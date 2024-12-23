import { AnswerFunction } from "../../answer.ts";
import { LanParty } from "./src/lanParty.ts";

export const answer: AnswerFunction = ([input]) => {
  const lanParty = LanParty.fromInput(input);

  const historianNetworks = lanParty.findNetworks().values().toArray();

  return [historianNetworks.toString(), ""];
};

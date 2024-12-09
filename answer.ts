type SingleAnswer = string | undefined;
export type Answers = [SingleAnswer, SingleAnswer];
export type AnswerFunction = (
  inputs: [string, string],
  type: "real" | "test"
) => Promise<Answers>;

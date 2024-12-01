import fs from "fs";
import path from "path";
import { AnswerFunction, Answers } from "./answer.ts";

export async function runWith(
  dayStr: string,
  type: "real" | "test"
): Promise<void> {
  const day = Number.parseInt(dayStr || "0", 10);
  if (!Number.isInteger(day)) {
    throw Error(`Unknown day "${day}"`);
  }

  const days: number[] = day
    ? [day]
    : fs
        .readdirSync(path.join(import.meta.dirname, "days"))
        .map(Number)
        .filter((a) => !Number.isNaN(a))
        .sort((a, b) => a - b);

  Promise.all(
    days.map(async (day) => {
      formatAnswer(
        day,
        (await getAnswer(day))(getInputs(day, type), type),
        getOutputs(day, type),
        getHintUsed(day)
      );
    })
  );
}

async function getAnswer(day: number): Promise<AnswerFunction> {
  try {
    return (await import(`./days/${day}/answer.ts`)).answer;
  } catch (error) {
    throw new Error(`Could not get AnswerFunction for day ${day}`, {
      cause: error
    });
  }
}

function getInput(day: number, filename: string): string {
  return fs
    .readFileSync(
      path.join(import.meta.dirname, `days/${day}/input/${filename}.txt`),
      "utf8"
    )
    .trimEnd()
    .replace(/\r\n/g, "\n");
}

function getInputs(day: number, type: string): [string, string] {
  try {
    return [getInput(day, type), ""];
  } catch {
    return [getInput(day, `${type}-part1`), getInput(day, `${type}-part2`)];
  }
}

function getOutput(day: number, filename: string): string | undefined {
  try {
    return fs
      .readFileSync(
        path.join(import.meta.dirname, `days/${day}/output/${filename}.txt`),
        "utf8"
      )
      .trimEnd()
      .replace(/\r\n/g, "\n");
  } catch {
    return;
  }
}

function getOutputs(day: number, type: string): Answers {
  return [getOutput(day, `${type}-part1`), getOutput(day, `${type}-part2`)];
}

function getHintUsed(day: number): boolean {
  return fs.existsSync(
    path.join(import.meta.dirname, `days/${day}/HINT_USED.md`)
  );
}

function formatAnswer(
  day: number,
  answerOutputs: Answers,
  expectedOutputs: Array<string | undefined>,
  hintUsed: boolean
) {
  const hintUsedText = hintUsed ? " 😓 hint used" : "";
  console.log(`Day ${day}:${hintUsedText}`);

  if (answerOutputs.every((output) => output === undefined)) {
    console.log("  No parts output by answer");
  } else {
    formatPart(1, answerOutputs[0], expectedOutputs[0]);
    formatPart(2, answerOutputs[1], expectedOutputs[1]);
  }
}

function formatPart(
  number: number,
  answerPart: string | undefined,
  expectedPart: string | undefined
) {
  if (answerPart === undefined) {
    return;
  }

  const checkedPart = `${answerPart}` === expectedPart ? "✅" : " ";

  const formattedPart =
    typeof answerPart === "string" && answerPart.includes("\n")
      ? `<<EOF\n${answerPart}\nEOF`
      : answerPart;

  console.log(`${checkedPart} Part ${number}: ${formattedPart}`);
}

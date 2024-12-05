import fs from "fs";
import path from "path";
import process from "process";
import { performance, type PerformanceEntry } from "perf_hooks";
import { AnswerFunction, Answers } from "./answer.ts";
import { randomUUID } from "crypto";

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

  const allPass = (
    await Promise.all(
      days.map(async (day) => {
        let answers: Answers;
        const measure = await withMeasurement(async () => {
          answers = (await getAnswer(day))(getInputs(day, type), type);
        });
        return {
          day,
          answers,
          measure
        };
      })
    )
  )
    .map(({ day, answers, measure }) =>
      checkAndOutputAnswer(
        day,
        answers,
        measure,
        getOutputs(day, type),
        getHintUsed(day)
      )
    )
    .every(Boolean);

  if (!allPass) {
    process.exit(1);
  }
}

async function withMeasurement(
  callback: () => Promise<void>
): Promise<PerformanceEntry> {
  const start = randomUUID();
  const end = randomUUID();
  const measure = `${start}->${end}`;

  try {
    performance.mark(start);
    await callback();
    performance.mark(end);
    performance.measure(measure, start, end);
    return performance.getEntriesByName(measure)[0];
  } finally {
    performance.clearMarks(start);
    performance.clearMarks(end);
    performance.clearMeasures(measure);
  }
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
      path.join(import.meta.dirname, `inputs/2024/${day}/${filename}.txt`),
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

function checkAndOutputAnswer(
  day: number,
  answerOutputs: Answers,
  measure: PerformanceEntry,
  expectedOutputs: Array<string | undefined>,
  hintUsed: boolean
): boolean {
  const hintUsedText = hintUsed ? "😓 hint used" : "";
  console.log(`Day ${day}: ${Math.ceil(measure.duration)}ms ${hintUsedText}`);

  if (answerOutputs.every((output) => output === undefined)) {
    console.log("  No parts output by answer");
    return false;
  } else {
    return [
      checkAndOutputAnswerPart(1, answerOutputs[0], expectedOutputs[0]),
      checkAndOutputAnswerPart(2, answerOutputs[1], expectedOutputs[1])
    ].every(Boolean);
  }
}

function checkAndOutputAnswerPart(
  number: number,
  answerPart: string | undefined,
  expectedPart: string | undefined
): boolean {
  if (answerPart === undefined) {
    return false;
  }

  const checked = answerPart === expectedPart;
  const checkedStr = checked ? "✅" : " ";

  const formattedPart =
    typeof answerPart === "string" && answerPart.includes("\n")
      ? `<<EOF\n${answerPart}\nEOF`
      : answerPart;

  console.log(`${checkedStr} Part ${number}: ${formattedPart}`);
  return checked;
}

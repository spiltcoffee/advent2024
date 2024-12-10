import fs from "fs";
import path from "path";
import process from "process";
import { performance, type PerformanceEntry } from "perf_hooks";
import { AnswerFunction, Answers } from "./answer.ts";
import { randomUUID } from "crypto";

export async function runWith(
  year: number,
  day: number,
  type: "real" | "test"
): Promise<void> {
  if (!Number.isInteger(year)) {
    throw Error(`Unknown year "${year}"`);
  }

  if (!Number.isInteger(day)) {
    throw Error(`Unknown day "${day}"`);
  }

  const days: number[] = day
    ? [day]
    : fs
        .readdirSync(path.join(import.meta.dirname, year.toString()))
        .map(Number)
        .filter((a) => !Number.isNaN(a))
        .sort((a, b) => a - b);

  const allPass = (
    await Promise.all(
      days.map(async (day) => {
        let answers: Answers;
        const measure = await withMeasurement(async () => {
          answers = await (
            await getAnswer(year, day)
          )(getInputs(year, day, type), type);
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
        getOutputs(year, day, type),
        getHintUsed(year, day)
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

async function getAnswer(year: number, day: number): Promise<AnswerFunction> {
  try {
    return (await import(`./${year}/${day}/answer.ts`)).answer;
  } catch (error) {
    throw new Error(`Could not get AnswerFunction for day ${day}`, {
      cause: error
    });
  }
}

function getInput(year: number, day: number, filename: string): string {
  return fs
    .readFileSync(
      path.join(import.meta.dirname, `inputs/${year}/${day}/${filename}.txt`),
      "utf8"
    )
    .trimEnd()
    .replace(/\r\n/g, "\n");
}

function getInputs(year: number, day: number, type: string): [string, string] {
  try {
    return [getInput(year, day, type), ""];
  } catch {
    return [
      getInput(year, day, `${type}-part1`),
      getInput(year, day, `${type}-part2`)
    ];
  }
}

function getOutput(
  year: number,
  day: number,
  filename: string
): string | undefined {
  try {
    return fs
      .readFileSync(
        path.join(import.meta.dirname, `${year}/${day}/output/${filename}.txt`),
        "utf8"
      )
      .trimEnd()
      .replace(/\r\n/g, "\n");
  } catch {
    return;
  }
}

function getOutputs(year: number, day: number, type: string): Answers {
  return [
    getOutput(year, day, `${type}-part1`),
    getOutput(year, day, `${type}-part2`)
  ];
}

function getHintUsed(year: number, day: number): boolean {
  return fs.existsSync(
    path.join(import.meta.dirname, `${year}/${day}/HINT_USED.md`)
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

import { AnswerFunction } from "../../answer.ts";

function parseReports(input: string): number[][] {
  return input
    .split("\n")
    .filter(Boolean)
    .map((report) =>
      report.split(" ").map((level) => Number.parseInt(level, 10))
    )
    .map((report) =>
      report.at(0) > report.at(-1) ? report.toReversed() : report
    );
}

function isSafeReport(report: number[]): boolean {
  return report.every((curr, index) => {
    if (index === 0) {
      return true;
    }
    const prev = report[index - 1];
    return [1, 2, 3].includes(curr - prev);
  });
}

function isDampenedReport(report: number[]): boolean {
  if (isSafeReport(report)) {
    return true;
  }

  for (let index = 0; index < report.length; index++) {
    if (isSafeReport(report.toSpliced(index, 1))) {
      return true;
    }
  }

  return false;
}

export const answer: AnswerFunction = ([input]) => {
  const reports = parseReports(input);

  const safeReports = reports.filter(isSafeReport).length;
  const dampenedReports = reports.filter(isDampenedReport).length;

  return [safeReports.toString(), dampenedReports.toString()];
};

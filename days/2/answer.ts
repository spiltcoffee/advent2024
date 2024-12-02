import { AnswerFunction } from "../../answer.ts";

export const answer: AnswerFunction = ([input]) => {
  const reports = input
    .split("\n")
    .filter(Boolean)
    .map((report) =>
      report.split(" ").map((level) => Number.parseInt(level, 10))
    );

  const safeReports = reports
    .map((report) => {
      if (report.at(0) > report.at(-1)) {
        report = report.toReversed();
      }

      try {
        report.reduce((prev, curr) => {
          if (prev === null) {
            return curr;
          }

          if (![1, 2, 3].includes(curr - prev)) {
            throw new Error(`unsafe! ${curr} ${prev}`);
          }
          return curr;
        }, null);
        return true;
      } catch {
        return false;
      }
    })
    .filter(Boolean).length;

  return [safeReports.toString(), ""];
};

import { program, Argument, Option } from "commander";
import { Temporal } from "temporal-polyfill";
import { runWith } from "./program.ts";

const NOW = Temporal.Now.plainDateISO();
const YEAR = NOW.month === 12 ? NOW.year : NOW.year - 1;

program
  .addOption(
    new Option("--year <year>", "which year to run")
      .default(YEAR, "year of most recent December")
      .argParser((val) => Number.parseInt(val, 10))
  )
  .addArgument(
    new Argument("<mode>", "mode to run as").choices(["test", "real"])
  )
  .addArgument(
    new Argument("[day]", "day to run")
      .default(0, "all")
      .argParser((val) => Number.parseInt(val, 10))
  )

  .action(
    async (mode: "test" | "real", day: number, { year }: { year: number }) =>
      runWith(year, day, mode)
  );

await program.parseAsync();

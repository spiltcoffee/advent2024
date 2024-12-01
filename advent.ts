import { program } from "commander";
import { runWith } from "./program.ts";

program
  .command("test [day]")
  .action(async (day: string) => runWith(day, "test"));
program
  .command("real [day]")
  .action(async (day: string) => runWith(day, "real"));
await program.parseAsync();

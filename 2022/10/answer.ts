import { AnswerFunction } from "../../answer.ts";

function filterInterestingSignals(signals: number[]): number[] {
  return signals.filter((v, i) => (i + 1) % 20 === 0 && (i + 1) % 40 === 20);
}

function mapSignalStrengths(cycles: number[]): number[] {
  return cycles.map((sigStr, index) => sigStr * (index + 1));
}

function renderDisplay(signals: number[]): string {
  const display = Array.from({ length: 6 }, () =>
    Array.from({ length: 40 }, () => ".")
  );
  signals.forEach((signal, index) => {
    const rowIndex = Math.floor(index / 40);
    const colIndex = index % 40;
    if (signal - 1 <= colIndex && signal + 1 >= colIndex) {
      display[rowIndex][colIndex] = "#";
    }
  });
  return display.map((row) => row.join("")).join("\n");
}

export const answer: AnswerFunction = ([input]) => {
  let x = 1;

  const signals = input.split("\n").flatMap((line) => {
    const [instruction, value] = line.split(" ");
    switch (instruction) {
      case "noop":
        return [x];
      case "addx": {
        const cycles = [x, x];
        x += Number(value);
        return cycles;
      }
      default:
        throw new Error(`unknown instruction "${instruction}`);
    }
  });

  const signalStrengths = mapSignalStrengths(signals);
  const interestingSignalStrengths = filterInterestingSignals(signalStrengths);

  const totalSignalStrengths = interestingSignalStrengths.reduce(
    (a, b) => a + b,
    0
  );

  const pixelDisplay = renderDisplay(signals);

  return [totalSignalStrengths.toString(), pixelDisplay];
};

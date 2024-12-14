import { AnswerFunction } from "../../answer.ts";

function getTotal(lines: string[]): number {
  return lines.reduce((total, line) => {
    const chars = line.split("");
    const leftNum = chars.find((char) => /\d/.exec(char));
    const rightNum = chars.findLast((char) => /\d/.exec(char));
    return total + Number.parseInt(leftNum + rightNum, 10);
  }, 0);
}

export const answer: AnswerFunction = ([part1, part2], type) => {
  const linesPart1 = part1.split("\n");
  const linesPart2 = type === "test" ? part2.split("\n") : linesPart1;

  const part1Total = getTotal(linesPart1);
  const part2Total = getTotal(
    linesPart2.map((line) => {
      const newLine: string[] = [];
      for (const index in line) {
        const currentLine = line.substring(index);
        if (currentLine.startsWith("one")) {
          newLine.push("1");
        } else if (currentLine.startsWith("two")) {
          newLine.push("2");
        } else if (currentLine.startsWith("three")) {          newLine.push("3");
        } else if (currentLine.startsWith("four")) {
          newLine.push("4");
        } else if (currentLine.startsWith("five")) {
          newLine.push("5");
        } else if (currentLine.startsWith("six")) {
          newLine.push("6");
        } else if (currentLine.startsWith("seven")) {          newLine.push("7");
        } else if (currentLine.startsWith("eight")) {          newLine.push("8");
        } else if (currentLine.startsWith("nine")) {
          newLine.push("9");
        } else {
          newLine.push(line[index]);
        }
      }
      return newLine.join("");
      line
        .replaceAll(/one/g, "1")
        .replaceAll(/two/g, "2")
        .replaceAll(/three/g, "3")
        .replaceAll(/four/g, "4")
        .replaceAll(/five/g, "5")
        .replaceAll(/six/g, "6")
        .replaceAll(/seven/g, "7")
        .replaceAll(/eight/g, "8")
        .replaceAll(/nine/g, "9")
    })
  );

  return [part1Total.toString(), part2Total.toString()];
};

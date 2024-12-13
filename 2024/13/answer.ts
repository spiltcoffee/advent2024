import { AnswerFunction } from "../../answer.ts";
import { Vector } from "../../common/vector.ts";

const REGEX_BUTTON = /Button \w: X\+(\d+), Y\+(\d+)/;
const PRIZE_BUTTON = /Prize: X=(\d+), Y=(\d+)/;

class ClawMachine {
  private readonly aVector: Vector;
  private readonly bVector: Vector;
  private readonly prizeVector: Vector;

  #canGetPrize: boolean = false;
  #aPresses: number = 0;
  #bPresses: number = 0;

  private constructor(aVector: Vector, bVector: Vector, prizeVector: Vector) {
    this.aVector = aVector;
    this.bVector = bVector;
    this.prizeVector = prizeVector;

    this.checkButtons();
  }

  static fromInput(input: string): ClawMachine {
    const [buttonALine, buttonBLine, prizeLine] = input.trim().split("\n");
    const [, ax, ay] = REGEX_BUTTON.exec(buttonALine);
    const [, bx, by] = REGEX_BUTTON.exec(buttonBLine);
    const [, px, py] = PRIZE_BUTTON.exec(prizeLine);

    return new ClawMachine(
      new Vector(Number.parseInt(ax, 10), Number.parseInt(ay, 10)),
      new Vector(Number.parseInt(bx, 10), Number.parseInt(by, 10)),
      new Vector(Number.parseInt(px, 10), Number.parseInt(py, 10))
    );
  }

  private checkButtons() {
    let currentVector = this.prizeVector;
    for (let bPresses = 1; bPresses <= 100; bPresses++) {
      currentVector = currentVector.subtract(this.bVector);
      if (
        currentVector.angle === this.aVector.angle &&
        currentVector.x % this.aVector.x === 0 &&
        currentVector.y % this.aVector.y === 0
      ) {
        this.#aPresses = Math.round(
          currentVector.magnitude / this.aVector.magnitude
        );
        this.#bPresses = bPresses;
        this.#canGetPrize = true;
      }
    }
  }

  get tokens(): number {
    if (!this.#canGetPrize) {
      return NaN;
    } else {
      return this.#aPresses * 3 + this.#bPresses;
    }
  }
}

export const answer: AnswerFunction = ([input]) => {
  const clawMachines = input.split("\n\n").map(ClawMachine.fromInput);

  const totalTokens = clawMachines
    .filter((clawMachine) => !Number.isNaN(clawMachine.tokens))
    .reduce((total, clawMachine) => total + clawMachine.tokens, 0);

  return [totalTokens.toString(), ""];
};

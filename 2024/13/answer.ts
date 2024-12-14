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

    // this.checkButtons();
    this.checkButtons2();
  }

  static fromInput(input: string, prizeOffset: number = 0): ClawMachine {
    const [buttonALine, buttonBLine, prizeLine] = input.trim().split("\n");
    const [, ax, ay] = REGEX_BUTTON.exec(buttonALine);
    const [, bx, by] = REGEX_BUTTON.exec(buttonBLine);
    const [, px, py] = PRIZE_BUTTON.exec(prizeLine);

    return new ClawMachine(
      new Vector(Number.parseInt(ax, 10), Number.parseInt(ay, 10)),
      new Vector(Number.parseInt(bx, 10), Number.parseInt(by, 10)),
      new Vector(
        Number.parseInt(px, 10) + prizeOffset,
        Number.parseInt(py, 10) + prizeOffset
      )
    );
  }

  private checkButtons2() {
    const apAngle = Vector.angleBetween(this.aVector, this.prizeVector);
    const bpAngle = Vector.angleBetween(this.bVector, this.prizeVector);
    const apMag = Vector.magnitudeFromAngleSideAngle(
      bpAngle,
      this.prizeVector.magnitude,
      apAngle
    );
    const bpMag = Vector.magnitudeFromAngleSideAngle(
      apAngle,
      this.prizeVector.magnitude,
      bpAngle
    );
    const approxAPresses = Math.round(apMag / this.aVector.magnitude);
    const approxBPresses = Math.round(bpMag / this.bVector.magnitude);

    if (
      this.aVector
        .multiply(approxAPresses)
        .add(this.bVector.multiply(approxBPresses))
        .equals(this.prizeVector)
    ) {
      this.#canGetPrize = true;
      this.#aPresses = approxAPresses;
      this.#bPresses = approxBPresses;
    }
  }

  private checkButtons() {
    let currentVector = this.prizeVector;
    let bPresses = 0;
    while (true) {
      bPresses++;
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

      const angles = [
        this.aVector.angle,
        this.prizeVector.angle,
        currentVector.angle
      ];
      if (
        Math.max(...angles) === currentVector.angle ||
        Math.min(...angles) === currentVector.angle
      ) {
        console.log({
          cvA: currentVector.angle,
          avA: this.aVector.angle,
          apAngle: Vector.angleBetween(this.aVector, this.prizeVector),
          bpAngle: Vector.angleBetween(this.bVector, this.prizeVector),
          currentVector,
          this: this,
          aVectorMag: this.aVector.magnitude,
          bVectorMag: this.bVector.magnitude,
          prizeVectorMag: this.prizeVector.magnitude
        });
        break;
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
  const part1ClawMachines = input
    .split("\n\n")
    .map((input) => ClawMachine.fromInput(input));
  const part2ClawMachines = input
    .split("\n\n")
    .map((inputs) => ClawMachine.fromInput(inputs, 10000000000000));

  const part1TotalTokens = part1ClawMachines
    .filter((clawMachine) => !Number.isNaN(clawMachine.tokens))
    .reduce((total, clawMachine) => total + clawMachine.tokens, 0);

  const part2TotalTokens = part2ClawMachines
    .filter((clawMachine) => !Number.isNaN(clawMachine.tokens))
    .reduce((total, clawMachine) => total + clawMachine.tokens, 0);

  return [part1TotalTokens.toString(), part2TotalTokens.toString()];
};

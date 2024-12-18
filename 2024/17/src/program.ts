import { modulo } from "../../../common/modulo.ts";

interface Registers {
  A: number;
  B: number;
  C: number;
}

export class Program {
  readonly #instructions: number[];
  readonly #registers: Registers;
  #pointer: number = 0;
  #output: number[] = [];

  private constructor(instructions: number[], registers: Registers) {
    this.#instructions = instructions;
    this.#registers = registers;
  }

  static fromInput(input: string): Program {
    const [registerAStr, registerBStr, registerCStr, , programStr] =
      input.split("\n");

    const [, registerAVal] = registerAStr.split(": ");
    const A = Number.parseInt(registerAVal, 10);

    const [, registerBVal] = registerBStr.split(": ");
    const B = Number.parseInt(registerBVal, 10);

    const [, registerCVal] = registerCStr.split(": ");
    const C = Number.parseInt(registerCVal, 10);

    const [, instructionsStr] = programStr.split(": ");
    const instructions = instructionsStr
      .split(",")
      .map((str) => Number.parseInt(str, 10));

    return new Program(instructions, { A, B, C });
  }

  get output(): string {
    return this.#output.join();
  }

  compute(): void {
    while (!this.isHalted) {
      const [opcode, operand] = this.#instructions.slice(
        this.#pointer,
        this.#pointer + 2
      );
      this.handleOpcode(opcode, operand);
      this.#pointer += 2;
    }
  }

  private get isHalted() {
    return this.#pointer >= this.#instructions.length;
  }

  private handleOpcode(opcode: number, operand: number): void {
    switch (opcode) {
      case 0:
        this.adv(operand);
        break;
      case 1:
        this.bxl(operand);
        break;
      case 2:
        this.bst(operand);
        break;
      case 3:
        this.jnz(operand);
        break;
      case 4:
        this.bxc(operand);
        break;
      case 5:
        this.out(operand);
        break;
      case 6:
        this.bdv(operand);
        break;
      case 7:
        this.cdv(operand);
        break;
      default:
        throw new Error(`Unknown opcode "${opcode}"`);
    }
  }

  private getComboOperand(operand: number) {
    switch (operand) {
      case 0:
      case 1:
      case 2:
      case 3:
        return operand;
      case 4:
        return this.#registers.A;
      case 5:
        return this.#registers.B;
      case 6:
        return this.#registers.C;
      // 7 not supported
      default:
        throw new Error(`Unknown combo operand ${operand}`);
    }
  }

  private adv(operand: number): void {
    this.#registers.A = Math.floor(
      this.#registers.A / Math.pow(2, this.getComboOperand(operand))
    );
  }

  private bxl(operand: number): void {
    this.#registers.B = this.#registers.B ^ operand;
  }

  private bst(operand: number): void {
    this.#registers.B = modulo(this.getComboOperand(operand), 8);
  }

  private jnz(operand: number): void {
    if (this.#registers.A === 0) {
      return;
    }

    // minus two to offset the increment that the loop will perform
    this.#pointer = operand - 2;
  }

  private bxc(_operand: number): void {
    this.#registers.B = this.#registers.B ^ this.#registers.C;
  }

  private out(operand: number): void {
    this.#output.push(modulo(this.getComboOperand(operand), 8));
  }

  private bdv(operand: number): void {
    this.#registers.B = Math.floor(
      this.#registers.A / Math.pow(2, this.getComboOperand(operand))
    );
  }

  private cdv(operand: number): void {
    this.#registers.C = Math.floor(
      this.#registers.A / Math.pow(2, this.getComboOperand(operand))
    );
  }
}

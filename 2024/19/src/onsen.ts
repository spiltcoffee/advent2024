import { Memoize } from "fast-typescript-memoize";

export class Onsen {
  readonly #towels: string[];
  readonly #patterns: string[];

  private constructor(towels: string[], patterns: string[]) {
    this.#towels = towels;
    this.#patterns = patterns;
  }

  static fromInput(input: string): Onsen {
    const [towelsLine, patternsLines] = input.split("\n\n");
    const towels = towelsLine.split(", ");
    const patterns = patternsLines.split("\n");
    return new Onsen(towels, patterns);
  }

  @Memoize()
  get validPatterns(): string[] {
    return this.#patterns.filter((pattern) => this.isPatternValid(pattern));
  }

  get totalValid(): number {
    return this.validPatterns.length;
  }

  get totalCombos(): number {
    return this.validPatterns.reduce((total, pattern) => {
      const combos = this.getTowelCombos(pattern);
      return total + combos;
    }, 0);
  }

  @Memoize()
  private isPatternValid(pattern: string) {
    if (!pattern) {
      return true;
    }

    return this.#towels.some((towel) => {
      return pattern.startsWith(towel)
        ? this.isPatternValid(pattern.substring(towel.length))
        : false;
    });
  }

  @Memoize()
  private getTowelCombos(pattern: string): number {
    if (!pattern) {
      return 1;
    }

    return this.#towels.reduce((total, towel) => {
      return (
        total +
        (pattern.startsWith(towel)
          ? this.getTowelCombos(pattern.substring(towel.length))
          : 0)
      );
    }, 0);
  }
}

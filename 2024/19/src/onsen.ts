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

  get validPatterns(): number {
    return this.#patterns.filter((pattern) => this.isPatternValid(pattern))
      .length;
  }

  private isPatternValid(pattern: string) {
    if (pattern === "") {
      return true;
    }

    return this.#towels.some((towel) => {
      return pattern.startsWith(towel)
        ? this.isPatternValid(pattern.substring(towel.length))
        : false;
    });
  }
}

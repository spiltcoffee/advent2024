import { Memoize } from "fast-typescript-memoize";

export class Computer {
  readonly #name: string;
  readonly #peers: Set<Computer> = new Set();

  private constructor(name: string) {
    this.#name = name;
  }

  @Memoize()
  static from(name: string): Computer {
    return new Computer(name);
  }

  get name(): string {
    return this.#name;
  }

  addPeer(peer: Computer): void {
    this.#peers.add(peer);
  }

  findNetworks(): Set<string> {
    let found = new Set<string>();

    for (const peer of this.#peers) {
      found = found.union(Computer.findNetworks(this, peer));
    }

    return found;
  }

  static findNetworks(aPeer: Computer, bPeer: computer): Set<string> {
    return new Set(
      aPeer.#peers
        .intersection(bPeer.#peers)
        .values()
        .map((cPeer) =>
          [aPeer, bPeer, cPeer]
            .map(({ name }) => name)
            .sort()
            .join()
        )
    );
  }
}

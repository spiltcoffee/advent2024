import { Computer } from "./computer.ts";

export class LanParty {
  readonly #peers: Set<Computer> = new Set();

  static fromInput(input: string) {
    const lanParty = new LanParty();

    input
      .split("\n")
      .forEach((pair) =>
        lanParty.addPeers(
          ...(pair.split("-", 2).map((name) => Computer.from(name)) as [
            Computer,
            Computer
          ])
        )
      );

    return lanParty;
  }

  addPeers(aPeer: Computer, bPeer: Computer): void {
    aPeer.addPeer(bPeer);
    bPeer.addPeer(aPeer);
    this.#peers.add(aPeer).add(bPeer);
  }

  findNetworks(): Set<string> {
    let found = new Set<string>();

    for (const peer of this.#peers) {
      found = found.union(peer.findNetworks());
    }

    return found;
  }
}

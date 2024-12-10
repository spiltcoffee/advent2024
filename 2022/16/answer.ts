import { AnswerFunction } from "../../answer.ts";

// todo: finish this answer

class Valve {
  private readonly tunnels: string[];

  readonly name: string;
  readonly rate: number;
  readonly openedAt: number;

  connectedValues: Valve[];

  constructor(name: string, rate: number, tunnels: string[]) {
    this.name = name;
    this.rate = rate;
    this.tunnels = tunnels;
    this.openedAt = 0;
  }

  buildConnections(valves: Valve[]) {
    this.connectedValues = this.tunnels.map((tunnel) =>
      valves.find((valve) => valve.name === tunnel)
    );
  }

  get released() {
    return this.rate * this.openedAt;
  }
}

export const answer: AnswerFunction = ([input]) => {
  const valves = input.split("\n").map((line) => {
    const [valvePart, tunnelsPart] = line
      // i don't fucking care
      .replace(" tunnel leads to valve ", "")
      .replace(" tunnels lead to valves ", "")
      .split(";");
    const [name, ratePart] = valvePart
      .replace("Valve ", "")
      .split(" has flow rate=");
    const rate = Number(ratePart);

    const tunnels = tunnelsPart.split(", ");

    return new Valve(name, rate, tunnels);
  });

  valves.forEach((valve) => valve.buildConnections(valves));

  const currentValve = valves.find((valve) => valve.name === "AA");

  for (let time = 30; time > 0; time--) {
    const openList = [{ valve: currentValve, distance: 0 }];
    const closedList = [];
    while (openList.length) {
      const { valve, distance } = openList.pop();
      closedList.push({
        valve,
        // minus an extra one to account for opening the valve
        pressure: valve.openedAt ? 0 : valve.rate * (time - distance - 1),
        distance
        //tunnels: valve.tunnels.map((tunnel) => tunnel.name)
      });

      // we won't be able to both reach and open any remaining tunnels
      if (distance + 1 === time) {
        continue;
      }

      valve.connectedValues.forEach((connectedValve) => {
        if (
          [...openList, ...closedList].find(
            ({ valve }) => valve === connectedValve
          )
        ) {
          return;
        }

        openList.unshift({ valve: connectedValve, distance: distance + 1 });
      });
    }
    // console.log(closedList);
    break;
  }

  return [undefined, undefined];
};

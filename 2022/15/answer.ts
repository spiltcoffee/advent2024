import { AnswerFunction } from "../../answer.ts";

enum NodeType {
  SENSOR = "SENSOR",
  BEACON = "BEACON"
}

class Node {
  readonly x: number;
  readonly y: number;
  readonly type: NodeType;

  constructor(x: number, y: number, type?: NodeType) {
    this.x = x;
    this.y = y;
    if (type) {
      this.type = type;
    }
  }
}

class BeaconNode extends Node {
  constructor(x: number, y: number) {
    super(x, y, NodeType.BEACON);
  }

  isAt(node: Node): boolean;
  isAt(x: number, y: number): boolean;
  isAt(xOrNode: number | Node, y?: number): boolean {
    if (typeof xOrNode === "number") {
      return this.x === xOrNode && this.y === y;
    } else {
      return this.x === xOrNode.x && this.y === xOrNode.y;
    }
  }
}

class SensorNode extends Node {
  readonly beacon: BeaconNode;

  constructor(x: number, y: number, beacon: BeaconNode) {
    super(x, y, NodeType.SENSOR);
    this.beacon = beacon;
  }

  manhattanDistanceFrom(otherNode: Node): number {
    return Math.abs(this.x - otherNode.x) + Math.abs(this.y - otherNode.y);
  }

  isWithinBeaconRange(otherNode: Node): boolean {
    const otherNodeDistance = this.manhattanDistanceFrom(otherNode);
    const beaconDistance = this.manhattanDistanceFrom(this.beacon);

    return otherNodeDistance <= beaconDistance;
  }

  buildNodesOutsideBeaconRange(maxPos: number): Node[] {
    const outsideRange = this.manhattanDistanceFrom(this.beacon) + 1;
    const nodes: Node[] = [];

    for (let xOffset = -outsideRange; xOffset <= outsideRange; xOffset++) {
      const x = this.x + xOffset;

      if (x < 0 || x > maxPos) {
        continue;
      }

      const yOffset = outsideRange - Math.abs(xOffset);
      const y = this.y + yOffset;
      const yNeg = this.y - yOffset;

      nodes.push(
        ...[
          y >= 0 && y <= maxPos && new Node(x, y),
          x !== this.x &&
            yNeg !== this.y &&
            yNeg >= 0 &&
            yNeg <= maxPos &&
            new Node(x, yNeg)
        ].filter(Boolean)
      );
    }
    return nodes;
  }
}

export const answer: AnswerFunction = ([input], type) => {
  const sensors: SensorNode[] = [];
  const beacons: BeaconNode[] = [];

  input.split("\n").forEach((line) => {
    const [sensorPart, beaconPart] = line.split(": ");
    const [sensorX, sensorY] = sensorPart
      .replace("Sensor at ", "")
      .split(", ")
      .map((coord) => Number(coord.replace(/\w=/, "")));

    const [beaconX, beaconY] = beaconPart
      .replace("closest beacon is at ", "")
      .split(", ")
      .map((coord) => Number(coord.replace(/\w=/, "")));

    const beacon =
      beacons.find((beacon) => beacon.isAt(beaconX, beaconY)) ||
      new BeaconNode(beaconX, beaconY);

    if (!beacons.includes(beacon)) {
      beacons.push(beacon);
    }

    const sensor = new SensorNode(sensorX, sensorY, beacon);

    sensors.push(sensor);
  });

  const largestDistance = Math.max(
    ...sensors.map((sensor) => sensor.manhattanDistanceFrom(sensor.beacon))
  );

  const allX = [...sensors, ...beacons].map((node) => node.x);
  const minX = Math.min(...allX) - largestDistance;
  const maxX = Math.max(...allX) + largestDistance;

  const y = type === "real" ? 2000000 : 10;
  const maxPos = type === "real" ? 4000000 : 20;

  const positionsWithoutBeacons = Array.from(
    { length: maxX - minX },
    (_, x) => {
      const nodeToTest = new Node(minX + x, y);
      return sensors.some((sensor) => sensor.isWithinBeaconRange(nodeToTest)) &&
        beacons.every((beacon) => !beacon.isAt(nodeToTest))
        ? nodeToTest
        : null;
    }
  ).filter(Boolean).length;

  let distressBeacon: Node = null;
  sensors.forEach((currSensor) => {
    if (!distressBeacon) {
      const nodes = currSensor.buildNodesOutsideBeaconRange(maxPos);
      distressBeacon = nodes.find(
        (node) => !sensors.some((sensor) => sensor.isWithinBeaconRange(node))
      );
    }
  });

  const tuningFreq = distressBeacon.x * 4000000 + distressBeacon.y;

  return [positionsWithoutBeacons.toString(), tuningFreq.toString()];
};

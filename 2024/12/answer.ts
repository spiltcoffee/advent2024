import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { CardinalDirection, Direction } from "../../common/direction.ts";
import { Map } from "../../common/map.ts";

class Side {
  readonly coordinate: Coordinate;
  readonly direction: CardinalDirection;

  private static SIDE_MAPPING: Record<CardinalDirection, [Side, Side, Side]> = {
    [Direction.NORTH]: [
      new Side(Coordinate.fromDirection(Direction.EAST), Direction.NORTH),
      new Side(Coordinate.fromDirection(Direction.NORTH_EAST), Direction.WEST),
      new Side(Coordinate.ORIGIN, Direction.EAST)
    ],
    [Direction.EAST]: [
      new Side(Coordinate.fromDirection(Direction.SOUTH), Direction.EAST),
      new Side(Coordinate.fromDirection(Direction.SOUTH_EAST), Direction.NORTH),
      new Side(Coordinate.ORIGIN, Direction.SOUTH)
    ],
    [Direction.SOUTH]: [
      new Side(Coordinate.fromDirection(Direction.WEST), Direction.SOUTH),
      new Side(Coordinate.fromDirection(Direction.SOUTH_WEST), Direction.EAST),
      new Side(Coordinate.ORIGIN, Direction.WEST)
    ],
    [Direction.WEST]: [
      new Side(Coordinate.fromDirection(Direction.NORTH), Direction.WEST),
      new Side(Coordinate.fromDirection(Direction.NORTH_WEST), Direction.SOUTH),
      new Side(Coordinate.ORIGIN, Direction.NORTH)
    ]
  };

  constructor(coordinate: Coordinate, direction: CardinalDirection) {
    this.coordinate = coordinate;
    this.direction = direction;
  }

  static lookingForSidesFrom(side: Side): [Side, Side, Side] {
    return <[Side, Side, Side]>(
      this.SIDE_MAPPING[side.direction].map((mappingSide) =>
        mappingSide.addCoord(side.coordinate)
      )
    );
  }

  addCoord(coordinate: Coordinate): Side {
    return new Side(this.coordinate.add(coordinate), this.direction);
  }
}

class Plant extends Coordinate {
  private readonly plant: string;
  isInPlanterBox: boolean = false;

  constructor(x: number, y: number, plant: string) {
    super(x, y);
    this.plant = plant;
  }

  findNeighbours(garden: Garden): [Plant[], Side[]] {
    const neighbours: Plant[] = [];
    const sides: Side[] = [];
    [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST].forEach(
      (direction: CardinalDirection) => {
        const neighbour = garden.getMapCell(
          this.add(Coordinate.fromDirection(direction))
        );

        if (this.plant === neighbour?.plant) {
          neighbours.push(neighbour);
        } else {
          sides.push(new Side(this, direction));
        }
      }
    );

    return [neighbours, sides];
  }
}

class PlanterBox {
  private readonly plants: Plant[];
  private readonly sides: Side[];

  private constructor(plants: Plant[], sides: Side[]) {
    this.plants = plants;
    this.sides = sides;
  }

  static fromPlant(plant: Plant, garden: Garden): PlanterBox {
    const plantsToCheck = [plant];
    const plants: Plant[] = [];
    const sides: Side[] = [];
    while (plantsToCheck.length) {
      const plant = plantsToCheck.shift();
      if (plant.isInPlanterBox) {
        continue;
      }
      plants.push(plant);
      plant.isInPlanterBox = true;
      const [neighbours, newSides] = plant.findNeighbours(garden);
      plantsToCheck.push(
        ...neighbours.filter((neighbour) => !neighbour.isInPlanterBox)
      );
      sides.push(...newSides);
    }
    return new PlanterBox(plants, sides);
  }

  private getBulkSides(): number {
    let bulkSides = 0;
    const sidesToCheck = [...this.sides];
    while (sidesToCheck.length > 0) {
      const firstSide = sidesToCheck.shift();
      let currentSide = firstSide;
      do {
        const lookingForSides = Side.lookingForSidesFrom(currentSide);
        const nextSideIndex = sidesToCheck.findIndex((side) =>
          lookingForSides.find(
            (lookingForSide) =>
              side.direction === lookingForSide.direction &&
              side.coordinate.equals(lookingForSide.coordinate)
          )
        );
        const [nextSide] =
          nextSideIndex >= 0 ? sidesToCheck.splice(nextSideIndex, 1) : [];

        if (currentSide.direction !== (nextSide || firstSide).direction) {
          bulkSides++;
        }
        currentSide = nextSide;
      } while (currentSide);
    }

    return bulkSides;
  }

  get cost() {
    return this.sides.length * this.plants.length;
  }

  get bulkCost() {
    return this.getBulkSides() * this.plants.length;
  }
}

class Garden extends Map<Plant> {
  private planterBoxes: PlanterBox[];

  private constructor(map: Plant[][]) {
    super(map);
    this.planterBoxes = [];
    this.forEachMapCell((plant) => {
      if (!plant.isInPlanterBox) {
        this.planterBoxes.push(PlanterBox.fromPlant(plant, this));
      }
    });
  }

  static fromInput(input: string): Garden {
    return new Garden(
      input
        .split("\n")
        .map((row, y) =>
          row.split("").map((plant, x) => new Plant(x, y, plant))
        )
    );
  }

  get cost() {
    return this.planterBoxes.reduce(
      (total, planterBox) => total + planterBox.cost,
      0
    );
  }

  get bulkCost() {
    return this.planterBoxes.reduce(
      (total, planterBox) => total + planterBox.bulkCost,
      0
    );
  }
}

export const answer: AnswerFunction = ([input]) => {
  const garden = Garden.fromInput(input);
  return [garden.cost.toString(), garden.bulkCost.toString()];
};

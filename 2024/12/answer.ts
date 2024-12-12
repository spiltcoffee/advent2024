import { AnswerFunction } from "../../answer.ts";
import { Coordinate } from "../../common/coordinate.ts";
import { Direction } from "../../common/direction.ts";
import { Map } from "../../common/map.ts";

class Plant extends Coordinate {
  private readonly plant: string;
  isInPlanterBox: boolean = false;

  constructor(x: number, y: number, plant: string) {
    super(x, y);
    this.plant = plant;
  }

  private get neighbourCoords(): Coordinate[] {
    return [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST]
      .map(Coordinate.fromDirection)
      .map((coord) => this.add(coord));
  }

  findNeighbours(garden: Garden): Plant[] {
    return garden
      .getMapCells(this.neighbourCoords)
      .filter((neighbour) => this.plant === neighbour.plant);
  }
}

class PlanterBox {
  private readonly plants: Plant[];
  private readonly perimeter: number;

  private constructor(plants: Plant[], perimeter: number) {
    this.plants = plants;
    this.perimeter = perimeter;
  }

  static fromPlant(plant: Plant, garden: Garden): PlanterBox {
    const plantsToCheck = [plant];
    let perimeter = 0;
    const plants: Plant[] = [];
    while (plantsToCheck.length) {
      const plant = plantsToCheck.shift();
      if (plant.isInPlanterBox) {
        continue;
      }
      plants.push(plant);
      plant.isInPlanterBox = true;
      const neighbours = plant.findNeighbours(garden);
      plantsToCheck.push(
        ...neighbours.filter((neighbour) => !neighbour.isInPlanterBox)
      );
      perimeter += 4 - neighbours.length;
    }
    return new PlanterBox(plants, perimeter);
  }

  get cost() {
    return this.perimeter * this.plants.length;
  }
}

class Garden extends Map<Plant> {
  private planterBoxes: PlanterBox[];

  static fromInput(input: string): Garden {
    return new Garden(
      input
        .split("\n")
        .map((row, y) =>
          row.split("").map((plant, x) => new Plant(x, y, plant))
        )
    );
  }

  private buildPlanterBoxes() {
    if (!this.planterBoxes) {
      this.planterBoxes = [];
      this.forEachMapCell((plant) => {
        if (!plant.isInPlanterBox) {
          this.planterBoxes.push(PlanterBox.fromPlant(plant, this));
        }
      });
    }
  }

  get cost() {
    this.buildPlanterBoxes();
    return this.planterBoxes.reduce(
      (total, planterBox) => total + planterBox.cost,
      0
    );
  }
}

export const answer: AnswerFunction = ([input]) => {
  const garden = Garden.fromInput(input);
  return [garden.cost.toString(), ""];
};

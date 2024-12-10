import { Coordinate } from "../../../common/coordinate.ts";

export class Trail {
  static readonly LOWEST = 0;
  static readonly HIGHEST = 9;
  private readonly higherTrails: Trail[];
  private readonly height: number;
  private readonly coord: Coordinate;

  constructor(height: number, coord: Coordinate) {
    this.height = height;
    this.coord = coord;
    this.higherTrails = [];
  }

  get isLowest(): boolean {
    return this.height === Trail.LOWEST;
  }

  get isHighest(): boolean {
    return this.height === Trail.HIGHEST;
  }

  addHigherTrails(trails: Trail[]) {
    if (this.isHighest) {
      return;
    }

    trails.forEach((trail) => {
      if (trail.height - this.height === 1) {
        this.higherTrails.push(trail);
      }
    });
  }

  private findTrailEnds(): Trail[] {
    if (this.isHighest) {
      return [this];
    }

    const result = this.higherTrails.flatMap((higherTrail) =>
      higherTrail.findTrailEnds()
    );

    return result;
  }

  getTrailHeadScores(): { trailEnds: number; distinctTrailEnds: number } {
    if (!this.isLowest) {
      return null;
    }

    const distinctTrailEnds = this.findTrailEnds();
    const trailEnds = new Set(distinctTrailEnds);

    return {
      trailEnds: trailEnds.size,
      distinctTrailEnds: distinctTrailEnds.length
    };
  }

  toString(): string {
    return `${this.coord}: H${this.height}`;
  }
}

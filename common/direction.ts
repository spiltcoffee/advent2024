export enum Direction {
  NORTH = "N",
  NORTH_EAST = "NE",
  EAST = "E",
  SOUTH_EAST = "SE",
  SOUTH = "S",
  SOUTH_WEST = "SW",
  WEST = "W",
  NORTH_WEST = "NW"
}

export type CardinalDirection =
  | Direction.NORTH
  | Direction.EAST
  | Direction.SOUTH
  | Direction.WEST;

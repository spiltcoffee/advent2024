import { Coordinate } from "../../../common/coordinate.ts";
import { Map } from "../../../common/map.ts";
import { EndTile } from "./endTile.ts";
import { FloorTile } from "./floorTile.ts";
import { StartTile } from "./startTile.ts";
import { Tile } from "./tile.ts";
import { WallTile } from "./wallTile.ts";
import * as pureimage from "pureimage";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import rgba from "color-rgba";

const TARGET_DIR = new URL("../target/", import.meta.url);

export class TileMap extends Map<Tile> {
  #endTile: EndTile = null;
  #movableTiles: Tile[] = null;

  static fromInput(input: string): TileMap {
    return new TileMap(
      input.split("\n").map((row, y) =>
        row.split("").map((cell, x) => {
          const coord = new Coordinate(x, y);
          switch (cell) {
            case "#":
              return new WallTile(coord);
            case ".":
              return new FloorTile(coord);
            case "S":
              return new StartTile(coord);
            case "E":
              return new EndTile(coord);
          }
        })
      )
    );
  }

  get endTile(): EndTile {
    if (!this.#endTile) {
      this.#endTile = this.getAllCells().find(
        (tile) => tile instanceof EndTile
      );
    }
    return this.#endTile;
  }

  get movableTiles(): Tile[] {
    if (!this.#movableTiles) {
      this.#movableTiles = this.getAllCells().filter((tile) => tile.movable);
    }
    return this.#movableTiles;
  }

  sortAndPopClosestTile(tiles: Tile[]): Tile {
    tiles.sort((a, b) =>
      Number.isFinite(a.distance)
        ? a.distance - b.distance
        : Number.isFinite(b.distance)
          ? 1
          : 0
    );
    const nextTile = tiles.shift();

    if (!nextTile) {
      return null;
    } else if (!Number.isFinite(nextTile.distance)) {
      tiles.unshift(nextTile);
      return null;
    } else {
      return nextTile;
    }
  }

  findShortestPaths(): void {
    const unvisited = [...this.movableTiles];

    let nextTile = this.sortAndPopClosestTile(unvisited);
    while (nextTile) {
      nextTile.visitNeighbours(this, unvisited);
      nextTile = this.sortAndPopClosestTile(unvisited);
    }
  }

  async draw(filename: string) {
    await mkdir(TARGET_DIR, { recursive: true });

    const image = pureimage.make(this.width, this.height);
    const ctx = image.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.width, this.height);

    const largestDistance = this.endTile.distance;

    function decToHex(dec: number): string {
      const result = Math.round(dec).toString(16);
      return result.length === 1 ? `0${result}` : result;
    }

    function getColor(distance: number): number {
      const progress = 120 - Math.round((distance / largestDistance) * 120);
      const rgbValues = rgba(
        `hsl(${progress >= 0 ? progress : 240}, 100%, 50%, .5)`
      ).slice(0, 3);
      return Number.parseInt(rgbValues.map(decToHex).concat("99").join(""), 16);
    }

    this.getAllCells().forEach((tile) => {
      ctx.fillPixelWithColor(
        tile.coordinate.x,
        tile.coordinate.y,
        tile.movable
          ? Number.isFinite(tile.distance)
            ? getColor(tile.distance)
            : 0xffffffff
          : 0x000000ff
      );
    });

    this.endTile
      .getShortestPaths()
      .forEach((path) =>
        path.forEach(({ coordinate: { x, y } }) =>
          ctx.fillPixelWithColor(x, y, 0x00ffffff)
        )
      );

    await pureimage.encodePNGToStream(
      image,
      createWriteStream(new URL(`./${filename}.png`, TARGET_DIR))
    );
  }
}

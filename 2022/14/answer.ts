import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

enum NodeType {
  EMPTY = ".",
  ROCK = "#",
  SAND = "o"
}

class Node {
  readonly row: number;
  readonly col: number;
  type: NodeType;

  constructor(row: number, col: number, type = NodeType.EMPTY) {
    this.row = row;
    this.col = col;
    this.type = type;
  }

  nodesBetween(grid, prevNode) {
    const rowDiff = this.row - prevNode.row;
    const rowOffset = Math.abs(rowDiff);
    const rowSign = Math.sign(rowDiff);
    const nodesBetween = [];
    const colDiff = this.col - prevNode.col;
    const colOffset = Math.abs(colDiff);
    const colSign = Math.sign(colDiff);

    if (rowOffset) {
      for (let i = 0; i < rowOffset; i++) {
        nodesBetween.push(grid.nodes[this.row - i * rowSign][this.col]);
      }
    } else {
      for (let i = 0; i < colOffset; i++) {
        nodesBetween.push(grid.nodes[this.row][this.col - i * colSign]);
      }
    }
    return nodesBetween;
  }
}

class Grid {
  readonly nodes: Node[][];
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.nodes = range(height).map((rowIndex) =>
      range(width).map((colIndex) => new Node(rowIndex, colIndex))
    );
    this.width = width;
    this.height = height;
  }

  isEmpty(row: number, col: number): boolean {
    return row >= 0 && row < this.height && col >= 0 && col < this.width
      ? this.nodes[row][col].type === NodeType.EMPTY
      : true;
  }

  render(): string {
    return this.nodes
      .map((row) => row.map((node) => node.type).join(""))
      .join("\n");
  }

  flattened(): Node[] {
    return this.nodes.flatMap((line) => line);
  }
}

function calculateSand(lines: Node[][], withFloor: boolean) {
  const flattened = lines.flatMap((line) => line);
  let height = Math.max(...flattened.map(({ row }) => row)) + 1;
  let width = Math.max(...flattened.map(({ col }) => col)) + 1;

  if (withFloor) {
    height += 2;
    width *= 2;
    lines.push([new Node(height - 1, 0), new Node(height - 1, width - 1)]);
  }
  const grid = new Grid(width, height);

  const normalised = lines.flatMap(
    (line) =>
      line.reduce(
        ({ prevNode, nodes }, node) => {
          return {
            prevNode: node,
            nodes: [
              ...nodes,
              ...(prevNode
                ? node.nodesBetween(grid, prevNode)
                : [grid.nodes[node.row][node.col]])
            ]
          };
        },
        { prevNode: null, nodes: [] }
      ).nodes
  );

  normalised.forEach((node) => (node.type = NodeType.ROCK));

  let row;
  let col;
  do {
    row = 0;
    col = 500;
    while (row < grid.height && grid.nodes[0][500].type !== NodeType.SAND) {
      if (grid.isEmpty(row + 1, col)) {
        row++;
      } else if (grid.isEmpty(row + 1, col - 1)) {
        row++;
        col--;
      } else if (grid.isEmpty(row + 1, col + 1)) {
        row++;
        col++;
      } else {
        grid.nodes[row][col].type = NodeType.SAND;
        break;
      }
    }
  } while (row < grid.height && grid.nodes[0][500].type !== NodeType.SAND);

  const sandNodes = grid
    .flattened()
    .filter((node) => node.type === NodeType.SAND);

  return sandNodes.length;
}

export const answer: AnswerFunction = ([input]) => {
  const lines = input.split("\n").map((line) =>
    line.split(" -> ").map((point) => {
      const [row, col] = point
        .split(",", 2)
        .map((val) => Number.parseInt(val, 10))
        .reverse();
      return new Node(row, col);
    })
  );

  const part1 = calculateSand(lines, false);
  const part2 = calculateSand(lines, true);

  return [part1.toString(), part2.toString()];
};

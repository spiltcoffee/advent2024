import { AnswerFunction } from "../../answer.ts";

enum NodeType {
  NORMAL = "NORMAL",
  START = "START",
  END = "END"
}

class Node {
  #path: Node[];
  #cost: number;

  readonly row: number;
  readonly col: number;
  readonly elevation: number;
  readonly type: NodeType;

  // 2024 me: what was I thinking?!
  displacement: number;
  heuristic: number;
  parentNode: Node;

  constructor(
    row: number,
    col: number,
    elevation: number,
    type = NodeType.NORMAL
  ) {
    this.row = row;
    this.col = col;
    this.elevation = elevation;
    this.type = type;
    // A*: g
    this.displacement = undefined;
    // A*: h
    this.heuristic = undefined;
    this.parentNode = null;
    this.#path = undefined;
  }

  get path(): Node[] {
    if (!this.#path) {
      if (!this.parentNode) {
        return [this];
      }

      this.#path = [this];
      let parentNode = this.parentNode;
      while (parentNode) {
        this.#path.unshift(parentNode);
        parentNode = parentNode.parentNode;
      }
    }
    return this.#path;
  }

  // A*: f
  get cost() {
    return this.#cost ? this.#cost : this.displacement + this.heuristic;
  }

  set cost(cost) {
    this.#cost = cost;
  }

  reset() {
    this.displacement = undefined;
    this.heuristic = undefined;
    this.parentNode = null;
    this.#cost = undefined;
    this.#path = undefined;
  }

  canAccess(otherNode: Node) {
    return otherNode.elevation - this.elevation <= 1;
  }
}

class Grid {
  static ELEVATIONS = "abcdefghijklmnopqrstuvwxyz";

  private readonly grid: Node[][];
  readonly width: number;
  readonly height: number;
  #flattened: Node[];
  #aElevationNodes: Node[];
  #startNode: Node;
  #endNode: Node;

  constructor(input: string) {
    this.grid = input.split("\n").map((row, rowIndex) =>
      row.split("").map((elevation, colIndex) => {
        let nodeType = NodeType.NORMAL;

        if (elevation === "S") {
          nodeType = NodeType.START;
          elevation = "a";
        }

        if (elevation === "E") {
          nodeType = NodeType.END;
          elevation = "z";
        }

        return new Node(
          rowIndex,
          colIndex,
          Grid.ELEVATIONS.indexOf(elevation),
          nodeType
        );
      })
    );
    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }

  get flattened() {
    if (!this.#flattened) {
      this.#flattened = this.grid.flatMap((row) => row);
    }
    return this.#flattened;
  }

  get startNode() {
    if (!this.#startNode) {
      this.#startNode = this.flattened.find(
        (node) => node.type === NodeType.START
      );
    }
    return this.#startNode;
  }

  get endNode() {
    if (!this.#endNode) {
      this.#endNode = this.flattened.find((node) => node.type === NodeType.END);
    }
    return this.#endNode;
  }

  get aElevationNodes() {
    if (!this.#aElevationNodes) {
      this.#aElevationNodes = this.flattened.filter(
        (node) => node.elevation === Grid.ELEVATIONS.indexOf("a")
      );
    }
    return this.#aElevationNodes;
  }

  reset() {
    this.flattened.forEach((node) => node.reset());
  }

  findAdjacentNodes({ row, col }) {
    return [
      row > 0 && this.grid[row - 1][col],
      row < this.height - 1 && this.grid[row + 1][col],
      col > 0 && this.grid[row][col - 1],
      col < this.width - 1 && this.grid[row][col + 1]
    ].filter(Boolean);
  }

  findPathToEndNode(startNode: Node): Node[] {
    const openList: Node[] = [];
    const closedList: Node[] = [];

    startNode.cost = 0;
    startNode.displacement = 0;

    openList.push(startNode);

    while (openList.length) {
      const currentNode = openList.sort((a, b) => b.cost - a.cost).pop();

      if (currentNode === this.endNode) {
        return currentNode.path;
      }

      closedList.push(currentNode);

      this.findAdjacentNodes(currentNode)
        .filter((adjacentNode) => {
          return (
            !closedList.includes(adjacentNode) &&
            currentNode.canAccess(adjacentNode)
          );
        })
        .forEach((adjacentNode) => {
          const displacement = currentNode.displacement + 1;
          const heuristic =
            Math.abs(this.endNode.row - currentNode.row) +
            Math.abs(this.endNode.col - currentNode.col);

          const isAlreadyInOpenList = openList.includes(adjacentNode);

          if (isAlreadyInOpenList && displacement > adjacentNode.displacement) {
            return;
          }

          adjacentNode.parentNode = currentNode;
          adjacentNode.displacement = displacement;
          adjacentNode.heuristic = heuristic;

          if (!isAlreadyInOpenList) {
            openList.push(adjacentNode);
          }
        });
    }
  }

  static PARENT_SYMBOL = {
    "-1,0": "↑",
    "1,0": "↓",
    "0,-1": "←",
    "0,1": "→"
  };

  // since it's for debug, I'll put up with the weirdness and just point at the parent
  renderPathPart(node: Node) {
    if (node.parentNode) {
      return Grid.PARENT_SYMBOL[
        `${node.parentNode.row - node.row},${node.parentNode.col - node.col}`
      ];
    }
    return "S";
  }

  renderPath(pathToPeak: Node[]) {
    return this.grid
      .map((row) =>
        row
          .map((node) => {
            return pathToPeak.includes(node)
              ? this.renderPathPart(node)
              : Grid.ELEVATIONS[node.elevation];
          })
          .join("")
      )
      .join("\n");
  }
}

export const answer: AnswerFunction = ([input]) => {
  const grid = new Grid(input);
  const pathToPeak = grid.findPathToEndNode(grid.startNode);

  const aElevationNodes = grid.aElevationNodes;

  const pathsToPeak = aElevationNodes
    .map((node) => {
      grid.reset();
      return grid.findPathToEndNode(node);
    })
    .filter(Boolean);

  const shortestPathFromLowestElevation = pathsToPeak
    .map((path) => path.length)
    .sort((a, b) => b - a)
    .at(-1);

  return [
    (pathToPeak.length - 1).toString(),
    (shortestPathFromLowestElevation - 1).toString()
  ];
};

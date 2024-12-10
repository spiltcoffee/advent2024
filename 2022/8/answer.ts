import range from "lodash.range";
import { AnswerFunction } from "../../answer.ts";

// assumption: input is always a square grid (i.e. width = height)

function treeGroupsFromIndex<T>(array: T[], index: number): T[][] {
  return [array.slice(0, index).reverse(), array.slice(index + 1)];
}

function getCol<T>(grid: T[][], colIndex: number): T[] {
  return grid.map((row) => row[colIndex]);
}

function createEmptyGrid<T>(width: number, height: number): T[][] {
  return range(height).map(() => range(width).map(() => null));
}

export const answer: AnswerFunction = ([input]) => {
  const grid = input.split("\n").map((row) => row.split(""));
  const gridHeight = grid.length;
  const gridWidth = grid[0].length;
  const visibleTrees = createEmptyGrid<boolean>(gridWidth, gridHeight);
  const scenicTrees = createEmptyGrid<number>(gridWidth, gridHeight);

  grid.map((row, rowIndex) =>
    row.map((currentTree, colIndex) => {
      const col = getCol(grid, colIndex);
      const surroundingTreeGroups = [
        ...treeGroupsFromIndex(row, colIndex),
        ...treeGroupsFromIndex(col, rowIndex)
      ];

      const treeGroupsHigherIndexes = surroundingTreeGroups.map((group) =>
        group.findIndex((tree) => tree >= currentTree)
      );

      const maxScenicScores = [
        colIndex,
        gridWidth - (colIndex + 1),
        rowIndex,
        gridHeight - (rowIndex + 1)
      ];

      const scenicScores = treeGroupsHigherIndexes.map((index, scoreIndex) =>
        index < 0 ? maxScenicScores[scoreIndex] : index + 1
      );

      visibleTrees[rowIndex][colIndex] =
        treeGroupsHigherIndexes.filter((index) => index >= 0).length < 4;
      scenicTrees[rowIndex][colIndex] = scenicScores.reduce((a, b) => a * b);
    })
  );

  const totalVisibleTrees = visibleTrees.reduce(
    (gridTotal, row) => gridTotal + row.filter(Boolean).length,
    0
  );

  const mostScenicTreeScore = Math.max(
    ...scenicTrees.map((row) => Math.max(...row))
  );

  return [totalVisibleTrees.toString(), mostScenicTreeScore.toString()];
};

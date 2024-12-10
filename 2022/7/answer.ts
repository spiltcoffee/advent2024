import { AnswerFunction } from "../../answer.ts";

type Folder<T> = { [key: string]: FolderField<T> };
type FolderField<T> = T | Folder<T>;
type File = string;
type Directory = Folder<File>;

function calculateDirectorySize(directory: Directory): number {
  return Object.values(directory).reduce(
    (total, node) =>
      total +
      (typeof node === "object"
        ? calculateDirectorySize(node)
        : Number.parseInt(node, 10)),
    0
  );
}

export const answer: AnswerFunction = ([input]) => {
  const filesystem: Directory = {
    "/": {}
  };
  const directories = [filesystem["/"]];
  const cwdStack: string[] = [];
  let cwd: File | Directory;

  input.split("\n").forEach((line) => {
    const parts = line.split(" ");
    if (parts[0] === "$") {
      if (parts[1] === "cd") {
        if (parts[2] === "..") {
          cwd = cwdStack.pop();
        } else {
          if (cwd) {
            cwdStack.push(<string>cwd);
            cwd = cwd[parts[2]];
          } else {
            cwd = filesystem[parts[2]];
          }
        }
      }
    } else {
      if (parts[0] === "dir") {
        cwd[parts[1]] = {};
        directories.push(cwd[parts[1]]);
      } else {
        cwd[parts[1]] = parts[0];
      }
    }
  });

  const directorySizes = directories.map(calculateDirectorySize);

  const smallestDirectories = directorySizes.filter((size) => size <= 100000);
  const smallestTotal = smallestDirectories.reduce((a, b) => a + b);

  // since first item is /
  const spaceUsed = directorySizes[0];
  const spaceRemaining = 70000000 - spaceUsed;
  const spaceRequired = 30000000 - spaceRemaining;

  const largestDirectories = directorySizes.filter(
    (size) => size > spaceRequired
  );
  const directorySizeToDelete = Math.min(...largestDirectories);

  return [smallestTotal.toString(), directorySizeToDelete.toString()];
};

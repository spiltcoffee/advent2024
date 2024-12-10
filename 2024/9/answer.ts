import { AnswerFunction } from "../../answer.ts";

interface File {
  id: number | null;
  size: number;
  moved?: boolean;
}

function checksum(values: number[]): number {
  return values.reduce(
    (total, id, index) => total + (id !== null ? id * index : 0),
    0
  );
}

function buildDrive(input: string): File[] {
  let id = 0;
  let isNullFile = false;

  return input
    .trim()
    .split("")
    .map((str) => Number.parseInt(str, 10))
    .map((size) => {
      try {
        return { id: isNullFile ? null : id, size };
      } finally {
        if (!isNullFile) {
          id++;
        }
        isNullFile = !isNullFile;
      }
    });
}

function flattenDrive(drive: File[]): number[] {
  return drive.flatMap(({ id, size: length }) =>
    Array.from({ length }, () => id)
  );
}

function splitFlattenedDrive(flattenedDrive: number[]): {
  dataPos: number[];
  nullPos: number[];
} {
  const result = flattenedDrive.reduce(
    (obj, id, index) => {
      (id === null ? obj.nullPos : obj.dataPos).push(index);
      return obj;
    },
    { dataPos: [], nullPos: [] }
  );
  result.nullPos.reverse();
  return result;
}

async function part1Checksum(drive: File[]): Promise<string> {
  const flattenedDrive = flattenDrive(drive);
  const { dataPos, nullPos } = splitFlattenedDrive(flattenedDrive);

  let nullIndex = nullPos.pop();
  let dataIndex = dataPos.pop();
  while (nullIndex < dataIndex) {
    flattenedDrive[nullIndex] = flattenedDrive[dataIndex];
    flattenedDrive[dataIndex] = null;
    nullIndex = nullPos.pop();
    dataIndex = dataPos.pop();
  }

  return checksum(flattenedDrive).toString();
}

async function part2Checksum(drive: File[]): Promise<string> {
  // clone drive
  drive = [...drive];
  let dataIndex: number;
  function findValidNullIndex(searchSize: number): number {
    const nullIndex = drive
      .slice(0, dataIndex)
      .findIndex(({ id, size }) => id === null && size >= searchSize);
    return nullIndex >= 0 ? nullIndex : null;
  }

  function nextDataIndex() {
    dataIndex = drive
      .slice(0, dataIndex)
      .findLastIndex(({ id, moved }) => id !== null && !moved);
    return dataIndex !== -1;
  }

  while (nextDataIndex()) {
    const file = drive[dataIndex];
    file.moved = true;
    const nullIndex = findValidNullIndex(file.size);
    if (!nullIndex) {
      continue;
    }

    if (nullIndex >= dataIndex) {
      continue;
    }

    const nullFile = drive[nullIndex];
    drive[nullIndex] = file;
    drive[dataIndex] = { id: null, size: file.size };
    if (nullFile.size > file.size) {
      drive.splice(nullIndex + 1, 0, {
        id: null,
        size: nullFile.size - file.size
      });
    }
  }

  const flattenedDrive = flattenDrive(drive);

  return checksum(flattenedDrive).toString();
}

export const answer: AnswerFunction = async ([input]) => {
  const drive = buildDrive(input);
  return [await part1Checksum(drive), await part2Checksum(drive)];
};

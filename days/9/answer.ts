import { AnswerFunction } from "../../answer.ts";

function addIds(array: number[], id: number, amount: number) {
  for (let index = 0; index < amount; index++) {
    array.push(id);
  }
}

function checksum(values: number[]): number {
  return values.reduce(
    (total, id, index) => total + (id !== null ? id * index : 0),
    0
  );
}

export const answer: AnswerFunction = ([input]) => {
  const drive = input.trim().split("");
  let fraggedDrive = [];
  let id = 0;

  while (drive.length) {
    const dataSize = Number.parseInt(drive.shift(), 10);
    const nullSize = Number.parseInt(drive.shift() || "0", 10);

    addIds(fraggedDrive, id, dataSize);
    addIds(fraggedDrive, null, nullSize);
    id++;
  }

  const { dataPos, nullPos } = fraggedDrive.reduce(
    (obj, id, index) => {
      id === null ? obj.nullPos.push(index) : obj.dataPos.push(index);
      return obj;
    },
    { dataPos: [], nullPos: [] }
  );

  let nullIndex = nullPos.shift();
  let dataIndex = dataPos.pop();
  while (nullIndex < dataIndex) {
    fraggedDrive[nullIndex] = fraggedDrive[dataIndex];
    fraggedDrive[dataIndex] = null;
    nullIndex = nullPos.shift();
    dataIndex = dataPos.pop();
  }

  const fraggedChecksum = checksum(fraggedDrive);
  return [fraggedChecksum.toString(), ""];
};

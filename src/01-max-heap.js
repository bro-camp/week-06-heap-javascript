const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

// eslint-disable-next-line no-unused-vars
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class MaxHeap {
  _elements;

  constructor() {
    this._elements = [];
  }

  static parent(index) {
    return Math.floor((index - 1) / 2);
  }

  static leftChild(index) {
    return Math.floor(2 * index + 1);
  }

  static rightChild(index) {
    return Math.floor(2 * index + 2);
  }

  size() {
    return this._elements.length;
  }

  insert(data) {
    this._elements.push(data);
    let currIdx = this._elements.length - 1;
    let parentIdx = MaxHeap.parent(currIdx);
    while (parentIdx >= 0) {
      if (this._elements[currIdx] <= this._elements[parentIdx]) return;

      const temp = this._elements[parentIdx];
      this._elements[parentIdx] = this._elements[currIdx];
      this._elements[currIdx] = temp;

      currIdx = parentIdx;
      parentIdx = MaxHeap.parent(currIdx);
    }
  }

  remove() {
    if (this._elements.length === 0) return null;

    const elms = this._elements;
    const len = elms.length;
    const ret = elms[0];
    elms[0] = elms[len - 1];
    let parent = 0;
    let leftChild = MaxHeap.leftChild(0);
    let rightChild = MaxHeap.rightChild(0);
    let selectedChild;
    while (leftChild < len || rightChild < len) {
      if (leftChild < len && rightChild < len) {
        if (elms[leftChild] > elms[rightChild]) {
          selectedChild = leftChild;
        } else {
          selectedChild = rightChild;
        }
      } else if (leftChild < len) {
        selectedChild = leftChild;
      } else {
        selectedChild = rightChild;
      }

      [elms[parent], elms[selectedChild]] = [elms[selectedChild], elms[parent]];
      leftChild = MaxHeap.leftChild(parent);
      rightChild = MaxHeap.rightChild(parent);
      parent = selectedChild;
    }

    elms.length -= 1;
    return ret;
  }

  toDotString() {
    let nodeDotStr = '';
    for (let i = 0, n = this._elements.length; i < n; i += 1) {
      nodeDotStr = `${nodeDotStr}  ${i} [label="${this._elements[i]}"];\n`;
    }

    let edgeDotStr = '';
    for (let i = 1, n = this._elements.length; i < n; i += 1) {
      edgeDotStr = `${edgeDotStr}  ${MaxHeap.parent(i)} -- ${i};\n`;
    }

    const dotStr = `graph G {\n  node [shape=circle];\n\n${nodeDotStr}\n${edgeDotStr}}`;

    return dotStr;
  }

  async createGraph() {
    const fileBaseName = '01-max-heap';

    const imgFileName = `${fileBaseName}.png`;
    const imgFileDir = path.resolve(__dirname, '../img');
    const imgFilePath = path.join(imgFileDir, imgFileName);

    const dotFileName = `${fileBaseName}.dot`;
    const dotFileDir = path.resolve(__dirname, '../dot');
    const dotFilePath = path.join(dotFileDir, dotFileName);

    const dotFileData = this.toDotString();

    let dotFileHandler;
    try {
      dotFileHandler = await fs.open(dotFilePath, 'w');
      await dotFileHandler.writeFile(dotFileData, 'ascii');
      spawnSync('dot', ['-Tpng', dotFilePath, '-o', imgFilePath]);
    } catch (err) {
      console.log(err);
    } finally {
      dotFileHandler?.close();
    }
  }
}

async function testMaxHeap() {
  const ar = [93, 78, 78, 79, 55, 59, 23, 52, 73, 13, 42, 4, 38, 47, 69, 42];
  const h = new MaxHeap();
  console.log(h);
  // for (let i = 1; i <= 17; i += 1) {
  //   h.insert(getRandomInt(100));
  // }
  for (let i = 0; i < ar.length; i += 1) {
    h.insert(ar[i]);
  }
  console.log(`size: ${h.size()}`);
  console.log(`[${h._elements}]`);
  // console.log(h.remove());
  console.log(`[${h._elements}]`);
  console.log(h.remove());
  console.log(h.remove());
  console.log(h.remove());
  console.log(h.remove());
  console.log(h.remove());
  // console.log(h.toDotString());
  await h.createGraph();
}

testMaxHeap();

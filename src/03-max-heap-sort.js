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

  static parent(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  static leftChild(parentIndex) {
    return (parentIndex * 2) + 1;
  }

  static rightChild(parentIndex) {
    return (parentIndex * 2) + 2;
  }

  size() {
    return this._elements.length;
  }

  insert(data) {
    const elms = this._elements;
    elms.push(data);

    let currIdx = elms.length - 1;
    let parentIdx = MaxHeap.parent(currIdx);

    while (parentIdx >= 0 && elms[currIdx] > elms[parentIdx]) {
      const temp = elms[parentIdx];
      elms[parentIdx] = elms[currIdx];
      elms[currIdx] = temp;

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
    let leftChild = MaxHeap.leftChild(parent);
    let rightChild = MaxHeap.rightChild(parent);

    while (leftChild < len || rightChild < len) {
      let selectedChild;
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

      parent = selectedChild;
      leftChild = MaxHeap.leftChild(parent);
      rightChild = MaxHeap.rightChild(parent);
    }

    elms.length -= 1;
    return ret;
  }

  toDotString() {
    const elms = this._elements;
    let nodeDotStr = '';
    for (let i = 0; i < elms.length; i += 1) {
      nodeDotStr = `${nodeDotStr}  ${i} [label="${elms[i]}"];\n`;
    }
    let edgeDotStr = '';
    for (let i = 1; i < elms.length; i += 1) {
      edgeDotStr = `${edgeDotStr}  ${MaxHeap.parent(i)} -- ${i};\n`;
    }
    const dotStr = `graph G {\n  node [shape=circle];\n\n${nodeDotStr}\n${edgeDotStr}}`;
    return dotStr;
  }

  async createGraph() {
    const fileBaseName = '03-max-heap-sort';

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
      console.error(err);
    } finally {
      dotFileHandler?.close();
    }
  }
}

function heapSortDesc(array) {
  const sortedArray = [];
  const h = new MaxHeap();
  for (let i = 0, n = array.length; i < n; i += 1) {
    h.insert(array[i]);
  }
  for (let i = 0, n = array.length; i < n; i += 1) {
    sortedArray.push(h.remove());
  }

  return sortedArray;
}

function testHeapSort() {
  const ar = [5, 6, 0, 2, -5, -2, 4, 2, 8, 1 - 2, 9, 5, 2, 0, 4, 1, 2, 6, 4];
  console.log(`[${ar}]`);
  const descSortedArray = heapSortDesc(ar);
  console.log(`[${descSortedArray}]`);
  console.log('\n\n');
}

testHeapSort();

// async function testMaxHeap() {
//   const h = new MaxHeap();
//   const a = [50, 6, 61, 45, 54, 44, 54, 9, 92, 18, 46, 33, 37, 80, 2, 20, 64];
//   // for (let i = 1; i <= 17; i += 1) {
//   //   a.push(getRandomInt(100));
//   // }

//   for (let i = 0; i < a.length; i += 1) {
//     h.insert(a[i]);
//   }

//   console.log(`[${h._elements}]`);
//   console.log(h.remove());
//   console.log(`[${h._elements}]`);
//   console.log(h.remove());
//   console.log(`[${h._elements}]`);
//   console.log(h.remove());
//   console.log(`[${h._elements}]`);
//   // console.log(h.toDotString());
//   await h.createGraph();
// }

// testMaxHeap();

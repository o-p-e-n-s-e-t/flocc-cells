const { utils } = require('flocc');
const { HEIGHT, WIDTH } = require('./constants');

// flat array
const storage = new Uint8Array(WIDTH * HEIGHT);
// hash map
const openCells = {};
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    openCells[x + ',' + y] = 1;
  }
}

exports.clear = function clear() {
  for (let i = 0; i < storage.length; i++) storage[i] = 0;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      openCells[x + ',' + y] = 1;
    }
  }
}

function XYtoIndex(x, y) {
  while (x < 0) x += WIDTH;
  while (y < 0) y += HEIGHT;
  while (x >= WIDTH) x-= WIDTH;
  while (y >= HEIGHT) y -= HEIGHT;

  return y * WIDTH + x;
}

exports.move = function move(oldX, oldY, newX, newY) {
  storage[XYtoIndex(oldX, oldY)] = 0;
  openCells[oldX + ',' + oldY] = 1;

  storage[XYtoIndex(newX, newY)] = 1;
  delete openCells[newX + ',' + newY];
}

function isOpen(x, y) {
  return openCells.hasOwnProperty(x + ',' + y);
}

exports.randomOpen = function randomOpen() {
  const keys = Object.keys(openCells);
  const coord = utils.sample(keys);
  const [x, y] = coord.split(',').map(v => +v);
  return { x, y };
}

exports.findOpen = function findOpen(cell) {
  const { x, y } = cell.getData();
  const open = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      if (isOpen(x + dx, y + dy)) {
        open.push({ x: x + dx, y: y + dy });
      }
    }
  }
  return utils.sample(open);
}
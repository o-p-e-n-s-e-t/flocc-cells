const { HEIGHT, SCALE, WIDTH } = require('./constants');
const { makeCell } = require('./agents');
const ui = require('./ui')
const { viz } = require('./viz');
const { randomOpen, findOpen, clear } = require('./utils');
const { Environment, Terrain, Colors } = require('flocc');

function go(cell) {
  flytTilEnTomPlads(cell);

  cell.increment('age');
  cell.increment('size', 1.5);

  if (cell.get('age') >= 3) {
    const open = findOpen(cell);
    if (open) {
      const newCell = makeCell(open);
      newCell.set('tick', go);
      environment.addAgent(newCell);
    }
  }

  if (cell.get('age') > 5) {
    cell.die();
  }
}

function flytTilEnTomPlads(cell) {
  // look for a neighboring empty cell
  // if one found, move there
  const open = findOpen(cell);
  if (open) cell.move(open.x, open.y);
}

function setup() {
  const urlParams = new URLSearchParams(window.location.search);
  const client = urlParams.get('client');
  if (client) return;

  window.environment = new Environment({ width: WIDTH, height: HEIGHT });
  environment.set({
    paused: true,
  });

  clear();

  const terrain = new Terrain(WIDTH, HEIGHT, {
    scale: SCALE
  });
  terrain.init(() => Colors.BLUE);
  environment.use(terrain);

  viz();
  if (!ui.hasInit()) {
    ui.init(setup);
  } else {
    ui.update(setup);
  }

  for (let i = 0; i < 100; i++) {
    const { x, y } = randomOpen();
    const cell = makeCell({ x, y });
    cell.set('tick', go);
    environment.addAgent(cell);
  }
  
  environment.renderers.forEach((r) => r.render());
}

setup();

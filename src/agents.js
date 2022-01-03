const { move } = require('./utils');
const { Agent } = require('flocc');

class Cell extends Agent {
  constructor(data) {
    super();

    if (data.x >= 0 && data.y >= 0) {
      move(-1, -1, data.x, data.y);
    }
    
    this.set({
      color: "green",
      age: 0,
      size: 1,
      ...data,
    });
  }

  die() {
    move(this.get('x'), this.get('y'), -1, -1);
    this.environment.removeAgent(this);
  }

  move(x, y) {
    move(this.get('x'), this.get('y'), x, y);
    this.set({ x, y });
  }
}

exports.makeCell = function makeCell(data) {
  return new Cell(data);
}
'use strict';

const DEAD = 0;
const LIVE = 1;

const defaultGridSize = 10;

class Game {

  constructor(grid, rules='23/3', randomise=true) {
    if (Array.isArray(grid)) {
      this.grid = grid;
      this.height = this.grid.length;
      this.width = this.grid[0].length;
    } else if (Number.isInteger(grid)) {
      this.grid = Game.buildGrid(grid, grid, randomise);
      this.height = this.width = grid;
    } else {
      this.grid = Game.buildGrid(defaultGridSize, defaultGridSize, randomise);
      this.height = this.width = defaultGridSize;
    }
    this.rules = Game.parseRules(rules);
  }

  static get DEAD() {
    return DEAD;
  }

  static get LIVE() {
    return LIVE;
  }

  static parseRules(rulestring) {
    let [survival, birth] = rulestring.split('/');
    return {
      survival: survival.split('').map(digit => parseInt(digit, 10)),
      birth: birth.split('').map(digit => parseInt(digit, 10))
    };
  }

  static buildGrid(width, height, randomise=true) {
    let grid = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        if (randomise)
          row.push(Math.round(Math.random()));
        else
          row.push(DEAD);
      }
      grid.push(row);
    }

    return grid;
  }

  sumNeighbours(x, y) {
    let sum = 0;

    // iterate over the 3x3 grid surrounding cell(x, y)
    for (let i = x - 1; i <= x + 1; i++)
      for (let j = y - 1; j <= y + 1; j++)
        // check cell(i, j) is within the grid
        if (i >= 0 && i < this.height && j >= 0 && j < this.width)
          // this cell is not a neighbour of itself
          if (i !== x || j !== y)
            sum += this.grid[i][j];

    return sum;
  }

  iterate() {
    return this.grid = this.grid.map(function(row, i) {
      return row.map(function(element, j) {
        let neighbours = this.sumNeighbours(i, j);

        if (this.grid[i][j] === DEAD && this.rules.birth.includes(neighbours))
          return LIVE;
        else if (this.grid[i][j] === LIVE && this.rules.survival.includes(neighbours))
          return LIVE;

        return DEAD;
      }, this);
    }, this);
  }

}

module.exports = Game;

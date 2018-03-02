'use strict';

class Game {
  constructor(grid, randomise=true) {
    if (Array.isArray(grid)) {
      this.grid = grid;
      this.height = this.grid.length;
      this.width = this.grid[0].length;
    } else if (Number.isInteger(grid)) {
      this.grid = Game.buildGrid(grid, grid, randomise);
      this.height = this.width = grid;
    } else {
      this.grid = Game.buildGrid(10, 10, randomise);
      this.height = this.width = 10;
    }
  }

  static buildGrid(width, height, randomise=true) {
    let grid = [];

    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        if (randomise)
          row.push(Math.round(Math.random()));
        else
          row.push(0);
      }
      grid.push(row);
    }

    return grid;
  }

  sumNeighbours(x, y) {
    let sum = 0;

    // iterate over the 3x3 grid surrounding cell(x, y)
    for (let i of [x - 1, x, x + 1])
      for (let j of [y - 1, y, y + 1])
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

        if (this.grid[i][j] === 0) {
          // Creation of Life
          if (neighbours === 3)
            return 1;

          // Remains the same
          return 0;
        }

        // Survival
        if (neighbours === 2 || neighbours === 3)
          return 1;

        // Under or Overpopulation
        return 0;
      }, this);
    }, this);
  }
}

module.exports = Game;

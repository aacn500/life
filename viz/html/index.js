import Game from '../..';

const gridsize = 70;
const container = document.getElementById('container');

function renderGrid(grid, container) {
  for (let i = 0; i < grid.length; i++) {
    let row = container.children[i];
    for (let j = 0; j < grid.length; j++) {
      let cell = row.children[j];
      if (grid[i][j] === Game.DEAD && cell.classList.contains('live'))
        cell.classList.remove('live');
      else if (grid[i][j] === Game.LIVE && !cell.classList.contains('live'))
        cell.classList.add('live');
    }
  }
}

function setup() {
  setupButtons();
  for (let n_row = 0; n_row < gridsize; n_row++) {
    let row = document.createElement('div');
    row.classList.add('row');

    for (let n_cell = 0; n_cell < gridsize; n_cell++) {
      let cell = document.createElement('div');
      cell.classList.add('cell');

      if (n_row === 0)
        cell.classList.add('cell-top');

      if (n_cell === 0)
        cell.classList.add('cell-left');

      row.appendChild(cell);
    }

    container.appendChild(row);
  }

  let game = new Game(gridsize);

  renderGrid(game.grid, container);

  let intervalID = setInterval(function() {
    game.iterate();
    renderGrid(game.grid, container);
  }, 200);

  return { game, intervalID };
}

function setupButtons() {
  document.getElementById('btn-pause').onclick = pause;
  document.getElementById('btn-step').onclick = step;
  document.getElementById('btn-play').onclick = play;
  document.getElementById('btn-reset').onclick = reset;
}

function pause() {
  clearInterval(intervalID);
  intervalID = 0;
}

function step() {
  if (intervalID)
    pause();
  game.iterate();
  renderGrid(game.grid, container);
}

function play() {
  if (!intervalID)
    intervalID = setInterval(function() {
      game.iterate();
      renderGrid(game.grid, container);
    }, 200);
}

function reset() {
  game = new Game(gridsize);
  renderGrid(game.grid, container);
}


let { game, intervalID } = setup();

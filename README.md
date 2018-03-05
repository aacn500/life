# life

## A JavaScript implementation of Conway's Game of Life

### Usage

This package contains a class, `Game`, which contains a basic implementation.
```js
const Game = require('life');

// creating a Game object without parameters will create a game
// with window size 10x10, with a randomised seed
let game = new Game();
game.iterate();
game.grid // =
// [[1, 0, 0],
//  [0, 1, 1],
//  [1, 0, 1]]


let seed = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 0, 0]
];
let seededGame = new Game(seed);
seededGame.iterate()

seededGame.grid // = 
// [[0, 1, 0],
//  [0, 1, 0],
//  [0, 1, 0]]

```

### Visualisers

This repository contains a console visualiser, which shows the grid as it iterates.

```bash
$ npm install
$ node ./viz/console.js
```

The repository also contains an HTML visualiser, which can be run in the browser. To build the browser script,

```bash
$ npm install
$ npm run build
```

and then open `viz/html/index.html` in your browser. These files are mirrored into `docs/` to provide hosting in GitHub pages, which can be viewed at <https://aacn500.github.io/life>

Both of these visualisers start with randomised seeds.

### Discussion

This implementation does have a limitation: the Game of Life takes place on an infinitely large grid. Any visualisation must then show a 'window' into that grid. This implementation only considers the grid inside that window and assumes that all cells outside that window are dead. In a more 'correct' implementation, this would be obviously false.

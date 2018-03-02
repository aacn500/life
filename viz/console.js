'use strict';

const util = require('util');
const Game = require('..');

const log = process.stdout.isTTY ? require('log-update') : console.log;
/**
 * An example visualiser which runs a game in the console output.
 * Shows a new frame every 200ms and ends after 10s.
 */

let game = new Game();

if (process.stdout.isTTY) {
  let interval = setInterval(function() {
    log(util.format(game.grid));
    game.iterate();
  }, 200);

  setTimeout(function(interval) {
    clearInterval(interval);
  }, 10000, interval);
} else {
  for (let i = 0; i < 50; i++) {
    log(util.format(game.grid));
    game.iterate();
  }
}

'use strict';

const util = require('util');
const log = require('log-update');
const Game = require('..');

/**
 * An example visualiser which runs a game in the console output.
 * Shows a new frame every 200ms and ends after 10s.
 */

let game = new Game();

let interval = setInterval(function() {
  log(util.format(game.grid));
  game.iterate();
}, 200);

setTimeout(function(interval) {
  clearInterval(interval);
}, 10000, interval);

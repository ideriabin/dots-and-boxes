/* global VERSION */

import './app.css';
import './field.css';
import Game from './lib/Game';
import Player from './lib/Player';

document.addEventListener('DOMContentLoaded', onInit);

function onInit() {
  setVersion();

  const game = new Game({
    field: { size: 4 },
    players: [new Player('Player 1'), new Player('Player 2')],
  });

  game.start();

  // eslint-disable-next-line no-console
  console.log(game);
}

function setVersion() {
  document.querySelector('.app-version').innerText = `v${VERSION}`;
}

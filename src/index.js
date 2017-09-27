/* global VERSION */

import './styles/app.css';
import './styles/field.css';
import './styles/players.css';

import Game from './lib/Game';
import Player from './lib/Player';
import UI from './lib/UI';

document.addEventListener('DOMContentLoaded', onInit);

function onInit() {
  setVersion();

  const game = new Game({
    field: { size: 4 },
    players: [new Player('Player 1'), new Player('Player 2')],
  });

  new UI('.app-content', game);

  game.start();
}

function setVersion() {
  document.querySelector('.app-version').innerText = `v${VERSION}`;
}

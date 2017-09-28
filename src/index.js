/* global VERSION */

import './styles/app.css';
import './styles/field.css';
import './styles/players.css';
import './styles/sizeSelector.css';

import Game from './lib/Game';
import Player from './lib/Player';
import UI from './lib/UI';

document.addEventListener('DOMContentLoaded', onInit);

function onInit() {
  const $version = document.querySelector('.app-version');
  const $welcome = document.querySelector('.app-welcome');
  const $game    = document.querySelector('.app-game');

  $version.innerText = `v${VERSION}`;

  $welcome.addEventListener('submit', (event) => {
    event.preventDefault();

    const { size } = formDataToObject(new FormData(event.target));
    const game = new Game({
      field: { size },
      players: [new Player('Player 1'), new Player('Player 2')],
    });

    new UI($game, game);

    $welcome.classList.remove('--active');
    $game.classList.add('--active');

    game.start();
  });
}

function formDataToObject(formData) {
  return Array.from(formData.entries())
    .reduce(
      (obj, [key, val]) => Object.assign(obj, { [key]: val }),
      {}
    )
  ;
}

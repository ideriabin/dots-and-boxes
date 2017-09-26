/* eslint-disable no-console */

import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';
import Player from './Player';
import emitter from './Emitter';

const ELEMENT = Symbol('ELEMENT');
const container = Symbol('container');
const edgeTypeClasses = {
  [TOP]: '--top',
  [BOTTOM]: '--bottom',
  [LEFT]: '--left',
  [RIGHT]: '--right',
};

export default class UI {
  constructor(containerSelector, game) {
    this[container] = document.querySelector(containerSelector);
    this.game = game;
    this.render(game.field);

    emitter.on('game:cell:owned', (cell) => {
      cell[ELEMENT].dataset.owner = this.game.players.indexOf(cell.owner);
    });

    emitter.on('game:turn:start', (player) => {
      this[container].dataset.turn = this.game.players.indexOf(player);
    });
  }

  render(field) {
    this[container].style.setProperty('--size', `${field.size}`);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < field.size; i++) {
      for (let j = 0; j < field.size; j++) {
        fragment.appendChild(
          this.createCellElement(field.cells.get(i, j))
        );
      }
    }

    this[container].appendChild(fragment);
  }

  createCellElement(cell) {
    const el = document.createElement('div');

    el.classList.add('field-cell');

    el.appendChild(this.createEdgeElement(cell.edges[TOP]));
    el.appendChild(this.createEdgeElement(cell.edges[BOTTOM]));
    el.appendChild(this.createEdgeElement(cell.edges[LEFT]));
    el.appendChild(this.createEdgeElement(cell.edges[RIGHT]));

    el.addEventListener('click', (e) => {
      if (!e.target.classList.contains('field-edge')) return;

      const type = Object.getOwnPropertySymbols(edgeTypeClasses).find(
        type => e.target.classList.contains(edgeTypeClasses[type])
      );

      this.onEdgeClick(cell.edges[type]);
    });

    cell[ELEMENT] = el;

    return el;
  }

  createEdgeElement(edge) {
    const el = document.createElement('div');
    el.classList.add('field-edge', edgeTypeClasses[edge.type]);
    edge[ELEMENT] = el;
    return el;
  }

  onEdgeClick(edge) {
    if (edge.owner instanceof Player) return;
    edge.owner = this.game.currentPlayer;

    edge[ELEMENT].classList.add('--active');
    edge[ELEMENT].dataset.owner = this.game.players.indexOf(edge.owner);

    emitter.emit('game:turn:end');
  }
}

/* eslint-disable no-console */

import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';
import Player from './Player';
import emitter from './Emitter';

const ELEMENT = Symbol('ELEMENT');
const CONTAINER = Symbol('CONTAINER');
const FIELD = Symbol('FIELD');
const PLAYERS = Symbol('PLAYERS');

const edgeTypeClasses = {
  [TOP]: '--top',
  [BOTTOM]: '--bottom',
  [LEFT]: '--left',
  [RIGHT]: '--right',
};

export default class UI {
  constructor(containerSelector, game) {
    this.game = game;

    this[CONTAINER] = document.querySelector(containerSelector);
    this[FIELD] = this[CONTAINER].querySelector('.field');
    this[PLAYERS] = this[CONTAINER].querySelector('.players');

    this.render();

    emitter.on('game:cell:owned', (cell) => {
      cell[ELEMENT].dataset.owner = this.game.players.indexOf(cell.owner);
    });

    emitter.on('game:turn:start', (player) => {
      this[CONTAINER].dataset.turn = this.game.players.indexOf(player);
    });

    emitter.on('game:finish', ({ winner }) => {
      const i = this.game.players.indexOf(winner);
      this[CONTAINER].dataset.turn = i;
      this[CONTAINER].dataset.winner = i;
    });
  }

  render() {
    this[CONTAINER].style.setProperty('--size', `${this.game.field.size}`);
    this.renderField(this.game.field);
    this.renderPlayers(this.game.players);
  }

  renderField(field) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < field.size; i++) {
      for (let j = 0; j < field.size; j++) {
        fragment.appendChild(
          this.createCellElement(field.cells.get(i, j))
        );
      }
    }

    this[FIELD].appendChild(fragment);
  }

  renderPlayers(players) {
    const fragment = document.createDocumentFragment();

    players.forEach(
      player => fragment.appendChild(this.createPlayerElement(player))
    );

    fragment.appendChild(this.createResultsElement());

    this[PLAYERS].appendChild(fragment);
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

  createPlayerElement(player) {
    const el = document.createElement('div');
    el.classList.add('players-item');

    const name = document.createElement('div');
    name.classList.add('players-name');
    name.innerText = player.name;
    el.appendChild(name);

    const score = document.createElement('div');
    score.classList.add('players-score');
    score.innerText = player.score;
    el.appendChild(score);

    emitter.on('player:score', (pl) => {
      if (player !== pl) return;
      score.innerText = player.score;
    });

    return el;
  }

  createResultsElement() {
    const el = document.createElement('div');
    el.classList.add('players-results');
    el.innerText = 'Winner!';
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

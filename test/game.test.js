/* eslint-env jest */

import unbindAll from 'nanoevents/unbind-all';
import { TOP, BOTTOM, LEFT, RIGHT } from '../src/lib/symbols';
import emitter from '../src/lib/Emitter';
import createGame from './create-game';

function ownAllCells(field, player) {
  field.cells.get(0, 0).edges[TOP].owner = player;
  field.cells.get(0, 0).edges[BOTTOM].owner = player;
  field.cells.get(0, 0).edges[LEFT].owner = player;
  field.cells.get(0, 0).edges[RIGHT].owner = player;

  field.cells.get(0, 1).edges[TOP].owner = player;
  field.cells.get(0, 1).edges[BOTTOM].owner = player;
  field.cells.get(0, 1).edges[RIGHT].owner = player;

  field.cells.get(1, 0).edges[BOTTOM].owner = player;
  field.cells.get(1, 0).edges[LEFT].owner = player;
  field.cells.get(1, 0).edges[RIGHT].owner = player;

  field.cells.get(1, 1).edges[BOTTOM].owner = player;
  field.cells.get(1, 1).edges[RIGHT].owner = player;
}

beforeEach(() => unbindAll(emitter));

it('should count number of player\'s boxes', () => {
  const game = createGame();
  const cell1 = game.field.cells.get(0, 0);
  const cell2 = game.field.cells.get(1, 1);

  cell1.edges[TOP].owner = game.players[0];
  cell1.edges[BOTTOM].owner = game.players[1];
  cell1.edges[LEFT].owner = game.players[0];
  expect(game.players[0].boxes).toBe(0);
  expect(game.players[1].boxes).toBe(0);
  cell1.edges[RIGHT].owner = game.players[1];
  expect(game.players[1].boxes).toBe(1);

  cell2.edges[TOP].owner = game.players[1];
  cell2.edges[BOTTOM].owner = game.players[0];
  cell2.edges[LEFT].owner = game.players[1];
  cell2.edges[RIGHT].owner = game.players[0];
  expect(game.players[0].boxes).toBe(1);
});

it('should let players take turns', () => {
  const game = createGame();
  const [player1, player2] = game.players;
  const cell = game.field.cells.get(0, 0);

  game.start();

  expect(game.currentPlayer).toEqual(player1);
  cell.edges[TOP].owner = game.currentPlayer;
  emitter.emit('game:turn:end');

  expect(game.currentPlayer).toEqual(player2);
  cell.edges[BOTTOM].owner = game.currentPlayer;
  emitter.emit('game:turn:end');

  expect(game.currentPlayer).toEqual(player1);
  cell.edges[LEFT].owner = game.currentPlayer;
  emitter.emit('game:turn:end');

  expect(game.currentPlayer).toEqual(player2);
  cell.edges[RIGHT].owner = game.currentPlayer;
  emitter.emit('game:turn:end');

  expect(game.currentPlayer).toEqual(player2);
});

it('should end when all boxes are enclosed', () => {
  const { field, players } = createGame({ field: { size: 2 } });
  let finished = false;

  emitter.on('game:finish', () => finished = true);
  ownAllCells(field, players[0]);

  emitter.emit('game:turn:end');
  expect(finished).toBe(true);
});

it('should determine winner', () => {
  let winner;

  const game1 = createGame({ field: { size: 2 } });
  emitter.on('game:finish', (result) => winner = result.winner);
  ownAllCells(game1.field, game1.players[0]);
  emitter.emit('game:turn:end');
  expect(winner).toEqual(game1.players[0]);

  unbindAll(emitter);

  const game2 = createGame({ field: { size: 2 } });
  emitter.on('game:finish', (result) => winner = result.winner);
  ownAllCells(game2.field, game2.players[1]);
  emitter.emit('game:turn:end');
  expect(winner).toEqual(game2.players[1]);
});

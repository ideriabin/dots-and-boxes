import { TOP, BOTTOM, LEFT, RIGHT } from '../src/lib/symbols';
import Emitter from '../src/lib/Emitter';
import createGame from './create-game';

beforeEach(() => Emitter.events = {});

it('should set up field', () => {
  const { field } = createGame({ field: { size: 5 } });
  expect(field.size).toEqual(5);
  expect(field.cells.size()).toEqual(5 * 5);
});

it('should check if cells exist', () => {
  const { field } = createGame();
  const { cells } = field;
  expect(cells.has(0, 0)).toBe(true);
  expect(cells.has(-1, -1)).toBe(false);
});

it('should set owners for edges only once', () => {
  const { field, players } = createGame();
  const edge = field.cells.get(0, 0).edges[TOP];

  edge.setOwner(players[0]);
  expect(() => edge.setOwner(players[1])).toThrow();
});

it('should mirror edge owners', () => {
  const { field, players } = createGame();
  const { cells } = field;
  const cell = cells.get(1, 1);

  cell.edges[TOP].setOwner(players[0]);
  expect(cells.get(cell, TOP).edges[BOTTOM].owner).toEqual(players[0]);

  cell.edges[BOTTOM].setOwner(players[1]);
  expect(cells.get(cell, BOTTOM).edges[TOP].owner).toEqual(players[1]);

  cell.edges[LEFT].setOwner(players[0]);
  expect(cells.get(cell, LEFT).edges[RIGHT].owner).toEqual(players[0]);

  cell.edges[RIGHT].setOwner(players[1]);
  expect(cells.get(cell, RIGHT).edges[LEFT].owner).toEqual(players[1]);
});

it('should set cell owner when it\'s enclosed', () => {
  const { field, players } = createGame();
  const cell = field.cells.get(1, 1);

  cell.edges[TOP].setOwner(players[0]);
  cell.edges[BOTTOM].setOwner(players[1]);
  cell.edges[LEFT].setOwner(players[0]);
  expect(cell.owner).toBeNull();
  cell.edges[RIGHT].setOwner(players[1]);
  expect(cell.owner).not.toBeNull();
});

it('should set cell owner to player that encloses it', () => {
  const { field, players } = createGame();
  const cell = field.cells.get(1, 1);

  cell.edges[TOP].setOwner(players[0]);
  cell.edges[BOTTOM].setOwner(players[1]);
  cell.edges[LEFT].setOwner(players[0]);
  cell.edges[RIGHT].setOwner(players[1]);
  expect(cell.owner).toEqual(players[1]);
});

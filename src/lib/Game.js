import Field from './Field';
import emitter from './Emitter';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import identity from 'lodash/identity';

const oneMoreTurn = Symbol('oneMoreTurn');

export default class Game {
  constructor(params) {
    this.players = params.players;
    this.field = new Field(params.field);

    this.currentPlayer = null;
    this[oneMoreTurn] = false;

    emitter.on('game:cell:owned', cell => this.onCellOwned(cell));
    emitter.on('game:turn:end', () => this.onTurnEnd());
  }

  start() {
    this.nextTurn();
    emitter.emit('game:start');
  }

  nextTurn() {
    if (this[oneMoreTurn]) this[oneMoreTurn] = false;
    else {
      const i = (this.players.indexOf(this.currentPlayer) + 1) % this.players.length;
      this.currentPlayer = this.players[i];
    }

    emitter.emit('game:turn:start', this.currentPlayer);
  }

  finish() {
    emitter.emit('game:finish', {
      winner: this.getWinner(),
    });
  }

  getWinner() {
    const scoreGroups = groupBy(this.players, 'score');
    const maxScore = orderBy(Object.keys(scoreGroups), identity, 'desc')[0];
    return scoreGroups[maxScore].length > 1 ? false : scoreGroups[maxScore][0];
  }

  onCellOwned(cell) {
    cell.owner.score++;
    this[oneMoreTurn] = true;
  }

  onTurnEnd() {
    if (this.field.allCellsHaveOwners()) this.finish();
    this.nextTurn();
  }
}

import Field from './Field';
import emitter from './Emitter';
import maxBy from 'lodash/maxBy';

export default class Game {
  constructor(params) {
    this.players = params.players;
    this.field = new Field(params.field);

    this.currentPlayer = null;
    this.oneMoreTurn = false;

    emitter.on('game:cell:owned', cell => this.onCellOwned(cell));
    emitter.on('game:turn:end', () => this.onTurnEnd());
  }

  start() {
    this.nextTurn();
    emitter.emit('game:start');
  }

  nextTurn() {
    if (this.oneMoreTurn) this.oneMoreTurn = false;
    else {
      const i = (this.players.indexOf(this.currentPlayer) + 1) % this.players.length;
      this.currentPlayer = this.players[i];
    }

    emitter.emit('game:turn:start', this.currentPlayer);
  }

  finish() {
    emitter.emit('game:finish', {
      winner: maxBy(this.players, player => player.boxes),
    });
  }

  onCellOwned(cell) {
    cell.owner.boxes++;
    this.oneMoreTurn = true;
  }

  onTurnEnd() {
    if (this.field.allCellsHaveOwners()) this.finish();
    this.nextTurn();
  }
}

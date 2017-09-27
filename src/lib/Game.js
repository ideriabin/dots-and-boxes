import Field from './Field';
import emitter from './Emitter';

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
    if (this.players[0].score > this.players[1].score) return this.players[0];
    if (this.players[0].score < this.players[1].score) return this.players[1];
    return false;
  }

  onCellOwned(cell) {
    cell.owner.score++;
    this[oneMoreTurn] = true;
  }

  onTurnEnd() {
    if (this.field.allCellsHaveOwners()) this.finish();
    else this.nextTurn();
  }
}

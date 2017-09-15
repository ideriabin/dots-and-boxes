import Field from './Field';
import emitter from './Emitter';

export default class Game {
  constructor(params) {
    this.players = params.players;
    this.field = new Field(params.field);

    emitter.on('cellOwned', cell => this.onCellOwned(cell));
    emitter.once('allCellsOwned', () => this.finish());
  }

  onCellOwned(cell) {
    cell.owner.boxes++;
  }

  finish() {
    const [player1, player2] = this.players;
    emitter.emit('onFinish', {
      winner: player1.boxes > player2.boxes? player1 : player2,
    });
  }
}

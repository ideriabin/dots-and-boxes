import Field from './Field';
import emitter from './Emitter';

export default class Game {
  constructor(params) {
    this.players = params.players;
    this.field = new Field(params.field);
  }
}

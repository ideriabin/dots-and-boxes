import Field from './Field';

export default class Game {
  constructor(params) {
    this.players = params.players;
    this.field = new Field(params.field);
  }
}

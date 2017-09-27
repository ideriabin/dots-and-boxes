import emitter from './Emitter';

const SCORE = Symbol('score');

export default class Player {
  constructor(name) {
    this.id = Symbol(name);
    this.name = name;
    this[SCORE] = 0;
  }

  get score() {
    return this[SCORE];
  }

  set score(score) {
    this[SCORE] = score;
    emitter.emit('player:score', this);
  }
}

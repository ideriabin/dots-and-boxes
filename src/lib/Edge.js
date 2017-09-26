import Player from './Player';
import emitter from './Emitter';

const owner = Symbol('owner');

export default class Edge {
  constructor(type, cell) {
    this.cell = cell;
    this.type = type;
    this[owner] = null;
  }

  get owner() {
    return this[owner];
  }

  set owner(player) {
    if (this[owner] instanceof Player) {
      throw new Error(`Edge is already taken`);
    }

    this[owner] = player;
    emitter.emit('field:edge:owned', this);
  }
}

import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';
import Player from './Player';
import emitter from './Emitter';

export default class Edge {
  constructor(type) {
    this.type = type;
    this.owner = null;
  }

  setOwner(player) {
    if (this.owner instanceof Player) {
      throw new Error(`Edge is already taken`);
    }

    this.owner = player;
    emitter.emit('edgeOwned', this);
  }
}

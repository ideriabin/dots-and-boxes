import { TOP, BOTTOM, LEFT, RIGHT  } from './symbols';
import CellStore from './CellStore';
import Cell from './Cell';
import emitter from './Emitter';

export default class Field {
  constructor(params) {
    this.size = params.size;
    this.cells = new CellStore(this);
    this.init();

    emitter.on('edgeOwned', edge => this.onEdgeOwned(edge));
  }

  init(size) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells.set(i, j, new Cell());
      }
    }
  }

  get(...args) {
    return this.cells.get(...args);
  }

  has(...args) {
    return this.cells.has(...args);
  }

  onEdgeOwned(edge) {
    this.mirrorEdgeOwner(edge);
  }

  mirrorEdgeOwner(edge) {
    const cell = this.get(cell => cell.has(edge));

    if (edge.type === TOP && this.has(cell, TOP)) {
      this.get(cell, TOP).edges[BOTTOM].owner = edge.owner;
    }

    if (edge.type === BOTTOM && this.has(cell, BOTTOM)) {
      this.get(cell, BOTTOM).edges[TOP].owner = edge.owner;
    }

    if (edge.type === LEFT && this.has(cell, LEFT)) {
      this.get(cell, LEFT).edges[RIGHT].owner = edge.owner;
    }

    if (edge.type === RIGHT && this.has(cell, RIGHT)) {
      this.get(cell, RIGHT).edges[LEFT].owner = edge.owner;
    }
  }
}

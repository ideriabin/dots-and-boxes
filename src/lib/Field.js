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

  init() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cells.set(i, j, new Cell());
      }
    }
  }

  onEdgeOwned(edge) {
    this.mirrorEdgeOwner(edge);
  }

  mirrorEdgeOwner(edge) {
    const cell = this.cells.get(cell => cell.has(edge));

    if (edge.type === TOP && this.cells.has(cell, TOP)) {
      this.cells.get(cell, TOP).edges[BOTTOM].owner = edge.owner;
    }

    if (edge.type === BOTTOM && this.cells.has(cell, BOTTOM)) {
      this.cells.get(cell, BOTTOM).edges[TOP].owner = edge.owner;
    }

    if (edge.type === LEFT && this.cells.has(cell, LEFT)) {
      this.cells.get(cell, LEFT).edges[RIGHT].owner = edge.owner;
    }

    if (edge.type === RIGHT && this.cells.has(cell, RIGHT)) {
      this.cells.get(cell, RIGHT).edges[LEFT].owner = edge.owner;
    }
  }
}

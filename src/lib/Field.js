import { TOP, BOTTOM, LEFT, RIGHT  } from './symbols';
import CellStore from './CellStore';
import Cell from './Cell';
import Player from './Player';
import emitter from './Emitter';

export default class Field {
  constructor(params) {
    this.size = params.size;
    this.cells = new CellStore(this);
    this.init();

    emitter.on('field:edge:owned', edge => this.onEdgeOwned(edge));
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

    if (edge.cell.allEdgesHaveOwners()) {
      edge.cell.owner = edge.owner;
      emitter.emit('game:cell:owned', edge.cell);
    }
  }

  mirrorEdgeOwner(edge) {
    if (!this.cells.has(edge.cell, edge.type)) return;

    const neighborCell = this.cells.get(edge.cell, edge.type);
    let mirrorEdge;

    if (edge.type === TOP)    mirrorEdge = neighborCell.edges[BOTTOM];
    if (edge.type === BOTTOM) mirrorEdge = neighborCell.edges[TOP];
    if (edge.type === LEFT)   mirrorEdge = neighborCell.edges[RIGHT];
    if (edge.type === RIGHT)  mirrorEdge = neighborCell.edges[LEFT];

    if (mirrorEdge.owner instanceof Player) return;
    mirrorEdge.owner = edge.owner;
  }

  allCellsHaveOwners() {
    let owned = 0;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        owned += Boolean(this.cells.get(i, j).owner);
      }
    }

    return owned === this.size * this.size;
  }
}

import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';
import Edge from './Edge';
import emitter from './Emitter';

export default class Cell {
  constructor() {
    this.owner = null;

    this.edges = {
      [TOP]: new Edge(TOP),
      [BOTTOM]: new Edge(BOTTOM),
      [LEFT]: new Edge(LEFT),
      [RIGHT]: new Edge(RIGHT),
    };

    emitter.on('edgeOwned', (edge) => {
      if (!this.has(edge)) return;
      this.onEdgeOwned(edge);
    });
  }

  has(edge) {
    return (
      this.edges[TOP] === edge ||
      this.edges[BOTTOM] === edge ||
      this.edges[LEFT] === edge ||
      this.edges[RIGHT] === edge
    );
  }

  onEdgeOwned(edge) {
    if (this.allEdgesHaveOwners()) {
      this.owner = edge.owner;
      emitter.emit('cellOwned', this);
    };
  }

  allEdgesHaveOwners() {
    return (
      this.edges[TOP].owner &&
      this.edges[BOTTOM].owner &&
      this.edges[LEFT].owner &&
      this.edges[RIGHT].owner
    );
  }
}

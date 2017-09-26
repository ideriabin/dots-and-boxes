import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';
import Edge from './Edge';

export default class Cell {
  constructor() {
    this.owner = null;

    this.edges = {
      [TOP]: new Edge(TOP, this),
      [BOTTOM]: new Edge(BOTTOM, this),
      [LEFT]: new Edge(LEFT, this),
      [RIGHT]: new Edge(RIGHT, this),
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

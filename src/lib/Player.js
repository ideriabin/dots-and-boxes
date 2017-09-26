export default class Player {
  constructor(name) {
    this.id = Symbol(name);
    this.name = name;
    this.score = 0;
  }
}

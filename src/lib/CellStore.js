import { TOP, BOTTOM, LEFT, RIGHT } from './symbols';

const store  = Symbol('store');
const decode = Symbol('decode');
const encode = Symbol('encode');

export default class CellStore {
  constructor() {
    this[store] = {};
  }

  [decode](key) {
    return key.split('-').map(n => parseInt(n));
  }

  [encode](i, j) {
    if (typeof j === 'symbol') {
      const key = Object.keys(this[store])[Object.values(this[store]).indexOf(i)];
      const [k, l] = this[decode](key);

      if (j === TOP)    return `${k-1}-${l  }`;
      if (j === BOTTOM) return `${k+1}-${l  }`;
      if (j === LEFT)   return `${k  }-${l-1}`;
      if (j === RIGHT)  return `${k  }-${l+1}`;

      throw new Error('Unknown relative key');
    }

    if (typeof i === 'number' && typeof j === 'number') {
      return `${i}-${j}`;
    }

    throw new Error('Unknown key');
  }

  get(i, j) {
    if (typeof i === 'function') {
      const keys = Object.keys(this[store]);

      for (let key of keys) {
        if (i(this[store][key], this[decode](key))) {
          return this[store][key];
        }
      }

      return;
    }

    return this[store][this[encode](i, j)];
  }

  set(i, j, val) {
    this[store][this[encode](i, j)] = val;
  }

  has(i, j) {
    return !!this[store][this[encode](i, j)];
  }

  size() {
    return Object.keys(this[store]).length;
  }
}

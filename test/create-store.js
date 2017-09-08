import CellStore from '../src/lib/CellStore';

export default function createStore({ size = 3 } = {}) {
  const store = new CellStore();

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      store.set(i, j, String(i) + String(j));
    }
  }

  return store;
}

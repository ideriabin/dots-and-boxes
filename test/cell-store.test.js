import { TOP, BOTTOM, LEFT, RIGHT } from '../src/lib/symbols';
import createStore from './create-store';

it('should validate key', () => {
  const store = createStore();
  expect(store.get(0, 0)).toEqual('00');
  expect(store.get(-1, -1)).toBeUndefined();
  expect(() => store.get(null)).toThrow();
});

it('should check it has item at key', () => {
  const store = createStore();
  expect(store.has(0, 0)).toBe(true);
  expect(store.has(-1, -1)).toBe(false);
});

it('should calculate its size', () => {
  const store = createStore({ size: 5 });
  expect(store.size()).toBe(25);
});

it('should properly calculate relative items', () => {
  const store = createStore();
  const item = store.get(1, 1);

  expect(store.get(item, TOP)).toEqual(store.get(0, 1));
  expect(store.get(item, BOTTOM)).toEqual(store.get(2, 1));
  expect(store.get(item, LEFT)).toEqual(store.get(1, 0));
  expect(store.get(item, RIGHT)).toEqual(store.get(1, 2));
  expect(() => store.get(item, Symbol())).toThrow();
});

it('should accept getter function', () => {
  const store = createStore();
  const item = store.get(1, 1);

  expect(store.get(item => item === '11')).toEqual(item);
  expect(store.get(item => item === null)).toBeUndefined();
});

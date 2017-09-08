import Field from '../src/lib/Field';

export default function createField(opts = {}) {
  const params = Object.assign({}, { size: 3 }, opts);
  return new Field(params);
}

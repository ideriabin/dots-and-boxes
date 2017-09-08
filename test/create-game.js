import Game from '../src/lib/Game';
import Player from '../src/lib/Player';

export default function createGame(opts) {
  const params = Object.assign({}, {
    field: { size: 4 },
    players: [new Player(), new Player()],
  }, opts);

  return new Game(params);
}

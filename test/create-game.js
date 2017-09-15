import Game from '../src/lib/Game';
import createPlayers from './create-players';

export default function createGame(opts = {}) {
  const params = Object.assign({}, {
    field: { size: 4 },
    players: createPlayers(),
  }, opts);

  return new Game(params);
}

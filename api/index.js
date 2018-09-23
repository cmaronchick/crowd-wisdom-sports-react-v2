import express from 'express';
import games from '../src/games-week3';

const router = express.Router();

const gamesObjs = games.games.reduce((obj, game) => {
  obj[game.gameId] = game;
  return obj;
}, {});

router.get('/games', (req, res) => {
  res.send({ games: gamesObjs });
});

router.get('/games/:gameId', (req, res) => {
  let game = gamesObjs[req.params.gameId];
  res.send(game);
});

export default router;

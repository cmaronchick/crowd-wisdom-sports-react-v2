import express from 'express';
//import games from '../src/games-week3';
import axios from 'axios';

const router = express.Router();

// const gamesObjs = games.games.reduce((obj, game) => {
//   obj[game.gameId] = game;
//   return obj;
// }, {});

const gamesAPIResponse = (year, gameWeek) => {
  if (year && gameWeek) {
    return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/${year}/${gameWeek}/games/anon`);
  }
  return axios.get('https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/3/games/anon');
};

router.get(['/games', '/games/:year/:gameWeek'], (req, res) => {
  gamesAPIResponse(req.params.year, req.params.gameWeek)
  .then((gamesResponse) => {
    const gamesResponseObjs = gamesResponse.data.games.reduce((obj, game) => {
      obj[game.gameId] = game;
      return obj;
    }, {});
    res.send({ games: gamesResponseObjs });
  })
  .catch(console.error);
});

router.get('/game/:gameId', (req, res) => {
  gamesAPIResponse()
  .then((gamesResponse) => {
    const gamesResponseObjs = gamesResponse.data.games.reduce((obj, game) => {
      obj[game.gameId] = game;
      return obj;
    }, {});
    let game = gamesResponseObjs[req.params.gameId];
    res.send(game);
  })
  .catch(console.error);
});

export default router;

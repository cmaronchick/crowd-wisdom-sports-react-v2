import express from 'express';
//import games from '../src/games-week3';
import axios from 'axios';
import Auth from '@aws-amplify/auth'
import { userInfo } from 'os';

const router = express.Router();

// const gamesObjs = games.games.reduce((obj, game) => {
//   obj[game.gameId] = game;
//   return obj;
// }, {});


const gamesAPIResponse = (year, gameWeek, userToken) => {
  var getOptions = {};
  var anonString = '/anon';
  if (userToken) {
    anonString = '';
    getOptions = {
      headers: {
        Authorization: userToken
      }
    };
  }
  console.log('year & gameWeek: ', year, ' & ', gameWeek)
  if (year && gameWeek) {
    return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/${year}/${gameWeek}/games${anonString}`, getOptions);
  }
  return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/3/games${anonString}`, getOptions);
};

router.get('/gameWeek', (req, res) => {
  console.log('api index 33 req', req.headers)
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/week/anon`)
      .then((gameWeekResponse) => {
//        console.log('api/index 35 gameWeekResponse', gameWeekResponse.data)
        res.send({ gameWeekData: gameWeekResponse.data })
      })
      .catch(gameWeekResponseError => console.log('api index 38 gameWeekResponseError: ', gameWeekResponseError))

})

router.get(['/games', '/games/:year/:gameWeek'], (req, res) => {
  //console.log('api index 44 req.headers.authorization: ', req.headers.authorization)
  gamesAPIResponse(req.params.year, req.params.gameWeek, req.headers.authorization)
    .then((gamesResponse) => {
      const gamesResponseObjs = gamesResponse.data.games.reduce((obj, game) => {
        obj[game.gameId] = game;
        return obj;
      }, {});
      res.send({ games: gamesResponseObjs });
    })
    .catch(console.error);
})

router.get('/game/:gameId', (req, res) => {
  console.log('api/index 55 req.params: ', req.headers)
  gamesAPIResponse()
  .then((gamesResponse) => {
    const gamesResponseObjs = gamesResponse.data.games.reduce((obj, game) => {
      obj[game.gameId] = game;
      return obj;
    }, {});
    let game = gamesResponseObjs[req.params.gameId];
    res.send(game);
  })
  .catch(gamesResponseError => console.log('gamesResponseError: ', gamesResponseError));
});

export default router;

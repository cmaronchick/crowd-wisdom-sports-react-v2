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

const callOptions = (userToken) => {
  var anonString = '/anon'
  var callOptions = Object.create(null);
  //console.log('api index 17 userToken: ', userToken)
  if (userToken) {
    callOptions = {
      headers: {
        Authorization: userToken
      }
    }
    anonString = '';
  }
  return { anonString, callOptions };
}

const gamesAPIResponse = (year, gameWeek, userToken) => {
  const callOptionsObject = callOptions(userToken);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  if (year && gameWeek) {
    return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/${year}/${gameWeek}/games${anonString}`, getOptions);
  }
  return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/3/games${anonString}`, getOptions);
};



router.get('/gameWeek', (req, res) => {
  //console.log('api index 33 req', req.headers)
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/week${anonString}`, getOptions)
      .then((gameWeekResponse) => {
//        console.log('api/index 35 gameWeekResponse', gameWeekResponse.data)
        res.send({ gameWeekData: gameWeekResponse.data })
      })
      .catch(gameWeekResponseError => console.log('api index 38 gameWeekResponseError: ', gameWeekResponseError))

})

router.get(['/games', '/games/:year/:gameWeek'], (req, res) => {
  //console.log('api index 54 req.headers.authorization: ', req.headers.authorization)
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
  //console.log('api/index 55 req.params: ', req.headers)
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

router.post('/submitPrediction', (req, res) => {
  console.log('api/index 81 req.body: ', req.body)
  axios.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/predictions`, req.body.body, {headers: 
    req.body.headers
  })
  .then(predictionResponse => {
    //console.log('predictionResponse: ', predictionResponse)
    res.send(predictionResponse)
  })
  .catch(predictionError => console.log('predictionError: ', predictionError))
})

export default router;

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

const gamesAPIResponse = (sport, year, season, gameWeek, userToken) => {
  const callOptionsObject = callOptions(userToken);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  //console.log('api index 33 anonString: ', anonString)
  if (year && gameWeek) {
    return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${gameWeek}/games${anonString}`, getOptions);
  }
  return axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/2018/3/games${anonString}`, getOptions);
};



router.get('/:sport/gameWeek', (req, res) => {
  //console.log('api index 43 req', req.params.sport)
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${req.params.sport}/week${anonString}`, getOptions)
      .then((gameWeekResponse) => {
//        console.log('api/index 35 gameWeekResponse', gameWeekResponse.data)
        res.send({ gameWeekData: gameWeekResponse.data })
      })
      .catch(gameWeekResponseError => console.log('api index 38 gameWeekResponseError: ', gameWeekResponseError))

})

router.get(['/:sport/games', '/:sport/games/:year/:season/:gameWeek'], (req, res) => {
  //console.log('api index 54 req.headers.authorization: ', req.headers.authorization)
  //console.log('api index 57 params', req.params)
  gamesAPIResponse(req.params.sport, req.params.year, req.params.season, req.params.gameWeek, req.headers.authorization)
    .then((gamesResponse) => {
      const gamesResponseObjs = gamesResponse.data.games.reduce((obj, game) => {
        obj[game.gameId] = game;
        return obj;
      }, {});
      res.send({ games: gamesResponseObjs });
    })
    .catch(getGamesError => console.log('api index 65: ', getGamesError));
})

router.get('/:sport/:year/:season/:gameWeek/:gameId', (req, res) => {
  
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/${req.params.year}/${req.params.gameWeek}/games/${req.params.gameId}${anonString}`, getOptions)
  .then((gameResponse) => {
    // console.log('api index 77 game: ', gameResponse)
    res.send({ game: gameResponse.data });
  })
  .catch(gamesResponseError => console.log('gamesResponseError: ', gamesResponseError));
});

router.get('/:sport/:year/:season/:gameWeek/leaderboards', (req, res) => {
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${req.params.sport}/${req.params.year}/${req.params.season}/${req.params.week}/leaderboards`, getOptions)
  .then((overallLeaderboardResponse) => {
    res.send({ leaderboards: {
      overall: overallLeaderboardResponse.data
      }
    })
  })
  .catch((overallLeaderboardReject => console.log('overallLeaderboardReject: ', overallLeaderboardReject)))
})

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


router.get('/:sport/:year/:season/:week/leaderboards', (req, res) => {
  //console.log('api index 43 req', req.params.sport)
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${req.params.sport}/${req.params.year}/${req.params.season}/${req.params.week}/leaderboards`, getOptions)
      .then((leaderboardResponse) => {
       console.log('api/index 35 gameWeekResponse', gameWeekResponse.data)
        res.send({ leaderboardData: leaderboardResponse.data })
      })
      .catch(gameWeekResponseError => console.log('api leaderboard index 38 gameWeekResponseError: ', gameWeekResponseError))

})

export default router;

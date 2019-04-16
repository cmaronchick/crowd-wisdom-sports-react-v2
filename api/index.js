import express from 'express';
//import games from '../src/games-week3';
import axios from 'axios';
import Auth from '@aws-amplify/auth'

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

router.get('/gameWeek', (req, res) => {
  //try {
    //let user = await Auth.currentAuthenticatedUser()
    Auth.currentAuthenticatedUser()
    .then(user => {
      const getOptions = {
        headers: {
          Authorization: user.SignInUserSession.getIdToken().getJwtToken()
        }
      }
      console.log('getOptions', getOptions)
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/week`, getOptions)
      .then((gameWeekResponse) => {
        console.log('gameWeekResponse', gameWeekResponse.data)
        res.send({ gameWeekData: gameWeekResponse })
      })
      .catch(gameWeekResponseError => res.send({gameWeekResponseError}))
    })
  //} catch (authUserError) {
    .catch(authUserError => {
      console.log('authUserError:', authUserError)
      axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/nfl/week/anon`)
      .then(gameWeekResponse => {
        res.send({gameWeekData: gameWeekResponse.data}) // working
      })
      .catch(gameWeekResponseError => res.send({gameWeekResponseError}))
    .catch(getWeekError => console.log('api index getWeekError: ', getWeekError))
  //}
    })
})

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

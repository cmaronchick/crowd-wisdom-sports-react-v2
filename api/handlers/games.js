const ky = require('ky-universal');

const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const { callOptions } = require('../utils')
const getGameWeek = (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      return apiHost.get(`${req.params.sport}/week${anonString}`, getOptions)
      .then((gameWeekResponse) => {
          return gameWeekResponse.json()
      })
      .then(gameWeekResponseData => {
        return res.status(200).json({ data: gameWeekResponseData })
      })
      .catch(gameWeekResponseError => {
          console.log('api index 38 gameWeekResponseError: ', gameWeekResponseError)
          return res.status(500).json({ message: 'Something went wrong.'})
      })

}

const getGame = (req, res) => {
    const { compareUsername } = req.query;
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${req.params.sport}/${req.params.year}/${req.params.season}/${req.params.gameWeek}/games/${req.params.gameId}${anonString}`, getOptions)
    .then((gameResponse) => {
      return gameResponse.json()
    })
    .then(gameResponseJSON => {
      return res.status(200).json({ game: gameResponseJSON });
    })
    .catch(gameResponseError => {
        console.log('gameResponseError: ', gameResponseError)
        return res.status(500).json({message: gameResponseError})
    });
}

const getGamesByGameWeek = (req, res) => {
    //console.log('api index 57 query', req.params, req.url)
    const { sport, year, season, gameWeek } = req.params
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    return apiHost.get(`${sport}/${year}/${season}/${gameWeek}/games${anonString}${req.query && req.query.compareUsername ? `?compareUsername=${req.query.compareUsername}` : ''}`, getOptions)
      .then((gamesResponse) => {
          return gamesResponse.json()
      })
      .then(gamesResponse => {
        console.log({gamesResponse});
        const gamesResponseObjs = gamesResponse.games.reduce((obj, game) => {
          obj[game.gameId] = game;
          return obj;
        }, {});
        return res.status(200).json({ games: gamesResponseObjs, gameResults: gamesResponse.gameResults});
      })
      .catch(async (getGamesError) => {
          console.log('api index 65: ', getGamesError)
          if (getGamesError.response) {
              getGamesError = await getGamesError.response.json()
          }
          return res.status(500).json({ message: getGamesError})
      });
}

const submitPrediction = (req, res) => {
    console.log('api/index 69 req.body: ', req.body)
    return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/predictions`, {
      headers: {
        Authorization: req.headers.authorization,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    })
    .then(predictionResponse => {
      //let predictionJSON = await predictionResponse.json()
      console.log({predictionResponse: predictionResponse})
      return res.status(200).json({ prediction: predictionResponse } )
    })
    .catch(predictionError => {
      console.log('predictionError: ', predictionError)
      return res.status(500).json({ message: predictionError})
    })
}

module.exports = { getGameWeek, getGame, getGamesByGameWeek, submitPrediction }
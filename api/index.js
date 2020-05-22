const express = require('express');
//import games from '../src/games-week3';
const ky = require('ky-universal');

const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const router = express.Router();

// const gamesObjs = games.games.reduce((obj, game) => {
//   obj[game.gameId] = game;
//   return obj;
// }, {});

const callOptions = (userToken) => {
  var anonString = '/anon'
  var callOptions = {};
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

const gamesAPIResponse = (sport, year, season, gameWeek, userToken, query) => {
  const callOptionsObject = callOptions(userToken);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  console.log('api index 33 anonString: ', getOptions)
  if (year && gameWeek) {
    return apiHost.get(`${sport}/${year}/${season}/${gameWeek}/games${anonString}${query && query.compareUsername ? `?compareUsername=${query.compareUsername}` : ''}`, getOptions);
  }
  return apiHost.get(`nfl/2018/3/games${anonString}${query && query.compareUsername ? `?compareUsername=${query.compareUsername}` : ''}`, getOptions);
};



router.get('/:sport/week', (req, res) => {
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

})

router.get('/:sport/games/:year/:season/:gameWeek/:gameId', (req, res) => {
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
});

router.get(['/:sport/games', '/:sport/games/:year/:season/:gameWeek'], (req, res) => {
  //console.log('api index 54 req.headers.authorization: ', req.headers.authorization)
  //console.log('api index 57 query', req.params, req.url)
  const { sport, year, season, gameWeek } = req.params
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  return apiHost.get(`${sport}/${year}/${season}/${gameWeek}/games${anonString}${req.query && req.query.compareUsername ? `?compareUsername=${req.query.compareUsername}` : ''}`, getOptions)
    .then((gamesResponse) => {
        console.log('gamesResponse', gamesResponse)
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
});

// router.get('/:sport/leaderboards/:year/:season/:week', (req, res) => {
//   const callOptionsObject = callOptions(req.headers.authorization);
//   const anonString = callOptionsObject.anonString;
//   const getOptions = callOptionsObject.callOptions;
//   axios.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${req.params.sport}/${req.params.year}/${req.params.season}/${req.params.week}/leaderboards`, getOptions)
//   .then((overallLeaderboardResponse) => {
//     //console.log('overallLeaderboardResponse: ', overallLeaderboardResponse.data)
//     res.send({ leaderboards: {
//       overall: overallLeaderboardResponse.data
//       }
//     })
//   })
//   .catch((overallLeaderboardReject => console.log('overallLeaderboardReject: ', overallLeaderboardReject)))
// })

router.post('/submitPrediction', (req, res) => {
  // console.log('api/index 81 req.body: ', req.body)
  return ky.post(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/predictions`, req.body.body, {headers: 
    req.body.headers
  })
  .then(async predictionResponse => {
    //let predictionJSON = await predictionResponse.json()
    //console.log({predictionResponse: predictionResponse.data})
    res.send({ prediction: predictionResponse.data } )
  })
  .catch(predictionError => console.log('predictionError: ', predictionError))
})


router.get('/:sport/leaderboards/:year/:season/:week', (req, res) => {
  console.log('api index 114 req', {headers: req.headers, params: req.params})
  const { sport, year, season, week } = req.params;
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${week}/leaderboards?limit=10`, getOptions)
      .then((leaderboardResponse) => {
       //console.log('api/index 119 gameWeekResponse', leaderboardResponse.data)
        res.send({ leaderboardData: leaderboardResponse.data })
      })
      .catch(leaderboardResponseError => console.log('api leaderboard index 122 leaderboardResponseError: ', leaderboardResponseError))

})

router.get(['/:sport/crowds/:year', '/:sport/crowds/:year/:season'], (req, res) => {
  console.log('api index 129 req', {params: req.params})
  const { sport, year, season } = req.params;
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${year}${anonString}`, getOptions)
      .then((crowdsResponse) => {
        const crowdsResponseObjs = crowdsResponse.data.reduce((obj, crowd) => {
          obj[crowd.groupId] = crowd;
          return obj;
        }, {});
        res.send({ crowds: crowdsResponseObjs })
      })
      .catch(crowdsResponseError => console.log('api leaderboard index 139 leaderboardResponseError: ', crowdsResponseError))
})

router.get('/:sport/crowds/:year/:season/:crowdId', (req, res) => {
  console.log('api index 143 req', {params: req.params})
  const { sport, year, season, crowdId } = req.params;
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${year}/${crowdId}${anonString}`, getOptions)
      .then((crowdResponse) => {
       //console.log('api/index 119 gameWeekResponse', leaderboardResponse.data)
        res.send({ crowd: crowdResponse.data })
      })
      .catch(crowdResponseError => console.log('api leaderboard index 153 crowdResponseError: ', crowdResponseError))
})

router.get('/:sport/leaderboards/:year/:season/:week/crowdOverall', (req, res) => {
  const { sport, year, season, week } = req.params;
  console.log({ sport, year, season, week });
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${week}/leaderboards/crowdoverall`, getOptions)
  .then((crowdOverallResponse) => {
    // console.log('api/index 134 crowdOverallResponse', crowdOverallResponse)
     res.send({ crowd: crowdOverallResponse.data })
   })
   .catch(crowdOverallResponseError => console.log('api leaderboard index 137 crowdOverallResponse: ', crowdOverallResponseError))
})

router.get('/extendedprofile', (req, AmplifyAuth, res) => {
  console.log('req.user', req.user)
  //console.log({req: req.params});
  let { sport, year, season, week } = req.query;
  const callOptionsObject = callOptions(req.headers.authorization);
  const getOptions = callOptionsObject.callOptions;
  return ky.get(`${apiHost}extendedprofile?sport=${sport}&year=${year}&season=${season}&week=${week}`, getOptions)
  .then((userStatsResponse) => {
    // console.log('api/index 134 crowdOverallResponse', crowdOverallResponse)
     res.send({ userStatsResponse: userStatsResponse.data })
   })
   .catch(userStatsResponseError => console.log('api leaderboard index 150 userStatsResponseError: ', userStatsResponseError))

})

module.exports = router;

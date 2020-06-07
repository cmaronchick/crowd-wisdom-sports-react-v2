const express = require('express');
//import games from '../src/games-week3';
const ky = require('ky-universal');
const busboy = require('busboy');
const Amplify = require('aws-amplify')

const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const router = express.Router();

// const awsmobile = require('../awsmobile');
// Amplify.Auth.configure(awsmobile)
// Amplify.Storage.configure({
//     bucket: 'stakehousesports.com',
//     region: 'us-west-2',
// });
// Amplify.configure({
//   Auth: {
//     "region": "us-west-2",
//     "userPoolId": "us-west-2_zym3aCbQ3",
//     "userPoolWebClientId": "2n15lhk845sucm0k4fejjqcbev",
//     "identityPoolId": 'us-west-2:7f74c720-5f61-4b1d-b9fd-81ae626cfd40'
//   },
//   Storage: {
//     bucket: 'stakehousesports.com',
//     region: 'us-west-2',
//   }
  
// })
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

router.get('/sport/:sport/:year/:season', (req, res) => {
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    console.log('84 req.params', req.params)
    const { sport, year, season } = req.params;
      return apiHost.get(`${sport}/${year}/${season}`, getOptions)
      .then((seasonDetailsReponse) => {
          return seasonDetailsReponse.json()
      })
      .then(seasonDetails => {
        return res.status(200).json({ data: seasonDetails })
      })
      .catch(seasonDetailsReponseError => {
        let errorMessage = seasonDetailsReponseError
          console.log('api index 72 seasonDetailsReponseError: ', seasonDetailsReponseError)
          return res.status(500).json({ message: `Something went wrong. - ${errorMessage}`})
      })

})

router.get('/:sport/games/:year/:season/:gameWeek/game/:gameId', (req, res) => {
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
  //console.log('api index 57 query', req.params, req.url)
  const { sport, year, season, gameWeek } = req.params
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  console.log('anonString', anonString)
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
});

router.get('/:sport/leaderboards/:year/:season/:week', (req, res) => {
  const callOptionsObject = callOptions(req.headers.authorization);
  const anonString = callOptionsObject.anonString;
  const getOptions = callOptionsObject.callOptions;
  const { sport, year, season, week } = req.params
  return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/${sport}/${year}/${season}/${week}/leaderboards`, getOptions)
  .then((leaderboardResponse) => {
    //console.log('overallLeaderboardResponse: ', overallLeaderboardResponse.data)
    return leaderboardResponse.json()
  })
  .then(leaderboardResponse => {
    console.log('leaderboardResponse', leaderboardResponse)
    return res.status(200).json({ leaderboards: leaderboardResponse
    })
  })
  .catch(overallLeaderboardReject => {
    console.log('overallLeaderboardReject: ', overallLeaderboardReject);
    return res.status(500).json({ message: 'Something went wrong'});
  })
})

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

router.get(['/group/:sport/:year', '/:sport/crowds/:year'], (req, res) => {
  console.log('api index 129 req', {query: req.query})
  const { sport, year } = req.params; 
  const { season } = req.query
    const callOptionsObject = callOptions(req.headers.authorization);
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${year}${anonString}${season ? `?season=${season}` : ''}`, getOptions).json()
      .then((groupsResponse) => {
        console.log('groupsResponse', groupsResponse)
        groupsResponse = groupsResponse.sort((a,b) => a.results[sport][year][season].predictionScore > b.results[sport][year][season].predictionScore ? 1 : -1)
        const groupsResponseObjs = groupsResponse.reduce((obj, group) => {
          obj[group.groupId] = group;
          return obj;
        }, {});
        res.send({ groups: groupsResponse })
      })
      .catch(crowdsResponseError => console.log('api leaderboard index 139 leaderboardResponseError: ', crowdsResponseError))
})

router.get('/group/:sport/:year/:groupId', (req, res) => {
  console.log('api index 217 req', {params: req.params})
  const { sport, year, groupId } = req.params;
  const { season } = req.query
    const callOptionsObject = callOptions(req.headers.authorization);
    console.log('callOptionsObject', callOptionsObject)
    const anonString = callOptionsObject.anonString;
    const getOptions = callOptionsObject.callOptions;
    console.log('getOptions', getOptions)
      return ky.get(`https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/group/${sport}/${parseInt(year)}/${parseInt(groupId)}${anonString}${season ? `?season=${season}` : ''}`, getOptions)
      .then((groupResponse) => {
        console.log('groupResponse 225', groupResponse)
        return groupResponse.json()
      })
      .then(groupResponse => {
       console.log('api/index 119 gameWeekResponse', groupResponse)
        return res.status(200).json({ group: groupResponse })
      })
      .catch(groupResponseError => {
        console.log('api leaderboard index 153 crowdResponseError: ', groupResponseError)
        return res.status(500).json({ message: groupResponseError})
      })
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

router.get('/extendedprofile', (req, res) => {
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

router.post('/user/image', (req, res) => {
  console.log('req.user', req.headers)
  const BusBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  const busboy = new BusBoy({ headers: req.headers })
  let imageFilename;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
          return res.status(400).json({ error: 'Please submit JPG or PNG files only.'})
      }
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      const imageExtension = filename.split('.')[filename.split('.').length-1];
      imageFilename = `${Math.round(Math.random()*100000000000)}.${imageExtension}`;
      const filepath = path.join(os.tmpdir(), imageFilename);
      console.log('filepath', filepath)
      imageToBeUploaded = { filepath, mimetype }
      return file.pipe(fs.createWriteStream(filepath))
  });
  //console.log('imageToBeUploaded', imageToBeUploaded)
  busboy.on('finish', () => {
          return Amplify.Storage.put(`/users/avatars/${imageToBeUploaded.filepath}`, 'Protected Content', {
            level: 'public',
            contentType: imageToBeUploaded.mimetype
          })
      .then(() => {
          console.log('file uploaded')
          return res.status(200).json({ message: 'Image uploaded successfully'})
      })
      .catch((uploadImageError) => {
          console.error(uploadImageError)
          return res.status(500).json({uploadImageError})

      })
  })
  busboy.end(req.rawBody);
})

module.exports = router;

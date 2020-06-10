const express = require('express');
//import games from '../src/games-week3';
const ky = require('ky-universal');
const busboy = require('busboy');
const Amplify = require('aws-amplify')

const apiHost = ky.create({prefixUrl: `https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/`})
const router = express.Router();

const { getGameWeek, getGame, getGamesByGameWeek, submitPrediction } = require('./handlers/games')
const { getSportSeason } = require('./handlers/sport')
const { getLeaderboards, getCrowdLeaderboards } = require('./handlers/leaderboards')
const { getGroups, getGroup, joinGroup, leaveGroup } = require('./handlers/groups')
const { getExtendedProfile, uploadImage } = require('./handlers/users')

const { callOptions} = require('./utils')

router.get('/sport/:sport/:year/:season', getSportSeason)

//games calls
router.get('/:sport/week', getGameWeek)
router.get('/:sport/games/:year/:season/:gameWeek/game/:gameId', getGame);
router.get(['/:sport/games', '/:sport/games/:year/:season/:gameWeek'], getGamesByGameWeek);
router.post('/submitPrediction', submitPrediction)

//leaderboards calls
router.get('/:sport/leaderboards/:year/:season/:week', getLeaderboards)
router.get('/:sport/leaderboards/:year/:season/:week/crowdOverall', getCrowdLeaderboards)

//groups calls
router.post('/group/:sport/:year/:groupId/leavegroup', leaveGroup)
router.post('/group/:sport/:year/:groupId/joingroup', joinGroup)
router.get('/group/:sport/:year/:groupId', getGroup)
router.get(['/group/:sport/:year', '/:sport/crowds/:year'], getGroups)

// user calls
router.get('/extendedprofile', getExtendedProfile)
router.post('/user/image', uploadImage)

module.exports = router;

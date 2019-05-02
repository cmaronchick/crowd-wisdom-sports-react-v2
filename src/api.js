import axios from 'axios';
import Auth from '@aws-amplify/auth'

const postOptions = (userSession, body) => {
  const callOptions = {
    headers: {
      Authorization: userSession.getIdToken().getJwtToken(),
      'Content-type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  return callOptions;
}

const getOptions = (userSession) => {
  var anonString = '/anon'
  var callOptions = {}
  if (userSession) {
    callOptions = {
      headers: {
        Authorization: userSession.getIdToken().getJwtToken()
      }
    }
    anonString = ''
  }
  return { anonString, callOptions}
}

export const fetchGame = (sport, year, season, gameWeek, gameId, userSession) => {
  const getOptionsObj = getOptions(userSession);
  return axios.get(`/api/${sport}/${year}/${season}/${gameWeek}/${gameId}${getOptionsObj.anonString}`, getOptionsObj.callOptions)
    .then(resp => resp.data);
};

export const fetchGamesList = (sport, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/games`, getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeekGames = (sport, year, season, gameWeek, userSession) => {
  const getOptionsObj = getOptions(userSession)
  console.log(`api 41 /api/${sport}/games/${year}/${season}/${gameWeek}`);
  return axios.get(`/api/${sport}/games/${year}/${season}/${gameWeek}`, getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeek = (sport, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/${sport}/gameWeek`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const submitPrediction = (userSession, prediction) => {
  console.log('api 55: ', prediction)
  const postOptionsObj = postOptions(userSession, prediction)
  console.log('postOptionsObj: ', postOptionsObj)
  return axios.post('/api/submitPrediction', postOptionsObj)
  .then(resp => resp.data)
}

export const fetchOverallLeaderboard = (userSession, sport, year, season, week) => {
  const getOptionsObj = getOptions(userSession)
  const sportValue = sport ? sport : 'nfl'
  return axios.get(`/api/${sportValue}/${year}/${season}/${week}/leaderboards`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const getUserSession = (callback) => {
  Auth.currentSession()
  .then(userSession => {
    console.log('userSession: ', userSession)
    return callback(userSession)
  })
  .catch(userSessionError => {
    console.log('userSessionError: ', userSessionError)
    return callback(false)
  })
}


//export default fetchGame;

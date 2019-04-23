import axios from 'axios';

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

export const fetchGame = (gameId, userSession) => {
  return axios.get(`/api/game/${gameId}`, userSession)
    .then(resp => resp.data);
};

export const fetchGamesList = (userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get('/api/games', getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeekGames = (year, gameWeek, userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/games/${year}/${gameWeek}`, getOptionsObj.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeek = (userSession) => {
  const getOptionsObj = getOptions(userSession)
  return axios.get(`/api/gameWeek`, getOptionsObj.callOptions)
  .then(resp => resp.data)
}

export const submitPrediction = (userSession, prediction) => {
  console.log('api 55: ', prediction)
  const postOptionsObj = postOptions(userSession, prediction)
  console.log('postOptionsObj: ', postOptionsObj)
  return axios.post('/api/submitPrediction', postOptionsObj)
  .then(resp => resp.data)
}


//export default fetchGame;

import axios from 'axios';

const callOptions = (userSession) => {
  console.log('userSession: ', userSession)
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
  const getOptions = callOptions(userSession)
  console.log('fetchGamesList getOptions: ', getOptions);
  return axios.get('/api/games', getOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeekGames = (year, gameWeek, userSession) => {
  const getOptions = callOptions(userSession)
  console.log('year gameWeek:', year, ' ', gameWeek)
  console.log('getOptions: ', getOptions)
  return axios.get(`/api/games/${year}/${gameWeek}`, getOptions.callOptions)
  .then (resp => resp.data.games);
};

export const fetchGameWeek = (userSession) => {
  const getOptions = callOptions(userSession)
  return axios.get(`/api/gameWeek`, getOptions.callOptions)
  .then(resp => resp.data)
}


//export default fetchGame;

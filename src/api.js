import axios from 'axios';

export const fetchGame = gameId => {
  return axios.get(`/api/games/${gameId}`)
    .then(resp => resp.data);
};

export const fetchGamesList = () => {
  return axios.get('/api/games')
  .then (resp => resp.data.games);
};

export const fetchGameWeek = gameWeek => {
  return axios.get(`/api/games/2018/${gameWeek}`)
  .then (resp => resp.data.games);
};

//export default fetchGame;
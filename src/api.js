import axios from 'axios';

export const fetchGame = gameId => {
  return axios.get(`/api/game/${gameId}`)
    .then(resp => resp.data);
};

export const fetchGamesList = () => {
  return axios.get('/api/games')
  .then (resp => resp.data.games);
};

export const fetchGameWeek = (year, gameWeek) => {
  return axios.get(`/api/games/${year}/${gameWeek}`)
  .then (resp => resp.data.games);
};

//export default fetchGame;
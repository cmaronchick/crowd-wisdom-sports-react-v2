import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './src/components/App';

import config from './config';
import axios from 'axios';

// const getGameWeekData = axios.get(`${config.serverUrl}/api/gameWeek`)
//   .then(resp => {
//     console.log('resp :', resp.data);
//     return { year: resp.data.gameWeekData.year, week: resp.data.gameWeekData.week }
//   })
//   .catch(gameWeekError => console.log('gameWeekError :', gameWeekError));

const getApiUrl = (gameId, gameWeekData) => {
  
  if (gameId) {
    return `${config.serverUrl}/api/game/${gameId}`;
  }
  
  console.log('gameWeekData :', gameWeekData);
  
  if (gameWeekData) { 
    return `${config.serverUrl}/api/games/${gameWeekData.year}/${gameWeekData.week}`;
  }
  return `${config.serverUrl}/api/games`
  
};

const getInitialData = (gameId, year, week, apiData) => {
  if (gameId) {
    return {
      currentGameId: apiData.gameId,
      games: {
        [apiData.gameId]: apiData
      }
    };
  }
  return {
    year: year,
    gameWeek: week,
    games: apiData.games
  };
};

const serverRender = (gameId, year, gameWeek) => 
  axios.get(`${config.serverUrl}/api/gameWeek`)
  .then(gameWeekResp  => {
    const gameWeekData = gameWeekResp.data.gameWeekData;
    //const gameWeekData = { year: 2018, week: 21 };
    return gameWeekData;
  })
  .then(gameWeekData => {
    return axios.get(getApiUrl(gameId, gameWeekData))
      .then(resp => {
        const initialData = getInitialData(gameId, gameWeekData.year, gameWeekData.week, resp.data);
        const initialMarkup = ReactDOMServer.renderToString(
          <App initialData={initialData} />)
        const respObj = {
          initialMarkup: initialMarkup,
          initialData
        }
        console.log('respObj ', respObj )
        return respObj;
      })
      //.catch(initialMarkupError => console.log('initialMarkupError :', initialMarkupError))
    })
  // .catch(gameWeekRespError => console.log('gameWeekRespError: ', gameWeekRespError))

export default serverRender;

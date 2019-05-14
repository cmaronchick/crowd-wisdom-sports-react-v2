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
    return `${config.serverUrl}/api/${gameWeekData.sport}/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}/${gameId}`;
  }
  
  console.log('gameWeekData :', gameWeekData);
  
  if (gameWeekData) { 
    return `${config.serverUrl}/api/${gameWeekData.sport}/games/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}`;
  }
  return `${config.serverUrl}/api/${sport}/games`
  
};

const getInitialData = (gameId, sport, year, season, week, weeks, code, apiData) => {
  if (gameId) {
    return {
      currentGameId: apiData.game.gameId,
      game: apiData.game
    };
  }
  return {
    sport: sport,
    year: year,
    season: season,
    week: week,
    weeks: weeks,
    games: apiData.games,
    code: code
  };
};

const serverRender = (sport, year, season, gameWeek, gameId, query) => 

  axios.get(`${config.serverUrl}/api/${sport}/gameWeek`)
  .then(gameWeekResp  => {
    const gameWeekData = gameWeekResp.data.gameWeekData;
    //const gameWeekData = { year: 2018, week: 21 };
    return gameWeekData;
  })
  .then(gameWeekData => {
    year ? gameWeekData.year = year : null
    season ? gameWeekData.season = season : null
    gameWeek ? gameWeekData.week = gameWeek : null
    return axios.get(getApiUrl(gameId, gameWeekData))
      .then(resp => {
        const initialData = getInitialData(gameId, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data);
        //console.log('initialData: ', initialData)
        
        const initialMarkup = ReactDOMServer.renderToString(
          <App initialData={initialData} />)
        const respObj = {
          initialMarkup: initialMarkup,
          initialData
        }
        //console.log('respObj ', respObj )
        return respObj;
      })
      .catch(initialMarkupError => console.log('initialMarkupError :', initialMarkupError))
    })
  // .catch(gameWeekRespError => console.log('gameWeekRespError: ', gameWeekRespError))

export default serverRender;

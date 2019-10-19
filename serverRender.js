import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom'

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
    console.log(`${config.serverUrl}/api/${gameWeekData.sport}/games/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}/${gameId}`);
    return `${config.serverUrl}/api/${gameWeekData.sport}/games/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}/${gameId}`;
  }
  
  console.log('gameWeekData :', gameWeekData);
  
  if (gameWeekData) { 
    return `${config.serverUrl}/api/${gameWeekData.sport}/games/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}`;
  }
  return `${config.serverUrl}/api/${sport}/games`
  
};
const getLeaderboardsUrl = (gameWeekData) => {
  console.log('leaderboard gameWeekData: ', gameWeekData)
  if (gameWeekData) { 
    //return `${config.serverUrl}/api/${gameWeekData.sport}/leaderboards/${gameWeekData.year}/${gameWeekData.season}/${gameWeekData.week}`;
    return `${config.serverUrl}/api/${gameWeekData.sport}/leaderboards/2018/post/21`;
  }
  return `${config.serverUrl}/api/${sport}/leaderboards`
  
};
const getCrowdsUrl = (gameWeekData) => {
  const { sport, year, season } = gameWeekData
  return `${config.serverUrl}/group/${sport}/${year}`
  
};

const getInitialData = (gameId, sport, year, season, week, weeks, code, apiData, page, crowdId) => {
  if (gameId) {
    return {
      currentGameId: apiData.game.gameId,
      game: apiData.game,
      sport,
      year,
      season,
      gameWeek: week,
      week, 
      weeks,
      code,
      page: 'game'
    };
  }
  switch(page) {
    case 'leaderboards':
      return {
        sport: sport,
        year: year,
        season: season,
        week: week,
        weeks: weeks,
        leaderboardData: apiData,
        code: code,
        page: page
      }
    case 'crowds':
      return {
        sport: sport,
        year: year,
        season: season,
        week: week,
        weeks: weeks,
        crowdData: apiData,
        code: code,
        page: page
      }
    default:
      return {
        sport: sport,
        year: year,
        season: season,
        week: week,
        weeks: weeks,
        games: apiData.games,
        code: code,
        page: page
      };
  }
};

const serverRender = (req, sport, year, season, gameWeek, query, page, gameId, crowdId) => {
  switch (page) {
    case 'leaderboards':
      return axios.get(`${config.serverUrl}/api/${sport}/gameWeek`)
      .then(gameWeekResp => {
        const gameWeekData = gameWeekResp.data.gameWeekData;
        return gameWeekData;
      })
      .then(gameWeekData => {
      year ? gameWeekData.year = year : null
      season ? gameWeekData.season = season : null
      gameWeek ? gameWeekData.week = gameWeek : null
      return axios.get(getLeaderboardsUrl(gameWeekData))
        .then(resp => {
          const initialData = getInitialData(null, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, page);
          console.log('serverRender 87 leaderboardData: ', initialData)
          
          const initialMarkup = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={{}}>
              <App initialData={initialData} />
            </StaticRouter>
          )
          const respObj = {
            initialMarkup: initialMarkup,
            initialData
          }
          //console.log('respObj ', respObj )
          return respObj;
        })
        .catch(initialMarkupError => console.log('initialMarkupError :', initialMarkupError))
      })
    case 'crowds':
      return axios.get(`${config.serverUrl}/api/${sport}/gameWeek`)
      .then(gameWeekResp => {
        const gameWeekData = gameWeekResp.data.gameWeekData;
        return gameWeekData;
      })
      .then(gameWeekData => {
      year ? gameWeekData.year = year : null
      season ? gameWeekData.season = season : null
      gameWeek ? gameWeekData.week = gameWeek : null
      return axios.get(getCrowdsUrl(gameWeekData))
        .then(resp => {
          const initialData = getInitialData(gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, page, null, crowdId);
          console.log('serverRender 87 leaderboardData: ', initialData)
          
          const initialMarkup = ReactDOMServer.renderToString(
            <StaticRouter location={req.url} context={{}}>
              <App initialData={initialData} />
            </StaticRouter>
          )
          const respObj = {
            initialMarkup: initialMarkup,
            initialData
          }
          //console.log('respObj ', respObj )
          return respObj;
        })
        .catch(initialMarkupError => console.log('initialMarkupError :', initialMarkupError))
      })
    default:
      return axios.get(`${config.serverUrl}/api/${sport}/gameWeek`)
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
            const initialData = getInitialData(gameId, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, 'games');
            //console.log('initialData: ', initialData)
            
            const initialMarkup = ReactDOMServer.renderToString(
              <StaticRouter location={req.url} context={{}}>
                <App initialData={initialData} />
              </StaticRouter>
            )
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
  }
}

export default serverRender;

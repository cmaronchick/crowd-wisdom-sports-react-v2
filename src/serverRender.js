import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom'

import App from './components/App';

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
  return `${config.serverUrl}/api/${sport}/crowds/${year}`
  
};

const getInitialData = (id, sport, year, season, week, weeks, code, apiData, page, url, query) => {
  switch(page) {
    case 'leaderboards':
      return {
        sport,
        year,
        season,
        week,
        weeks,
        leaderboardData: apiData,
        code,
        page,
        url
      }
    case 'crowds':
      if (id) {
        return {
          sport,
          year,
          season,
          week,
          weeks,
          crowds: apiData.crowds,
          code,
          page,
          url,
          currentCrowdId: id
        }
      }
      return {
        sport,
        year,
        season,
        week,
        weeks,
        crowds: apiData.crowds,
        code,
        page,
        url,
        currentCrowdId: null
      }
    default:
      if (id) {
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
          page: 'game',
          compareUsername: query && query.compareUsername ? query.compareUsername : null,
          url
        };
      }
      return {
        sport,
        year,
        season,
        week,
        weeks,
        games: apiData.games,
        code,
        page,
        url,
        query
      };
  }
};

const serverRender = (req, sport, year, season, gameWeek, query, page, url, id) => {
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
          const initialData = getInitialData(null, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, page, url, query);
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
          const initialData = getInitialData(id, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, page, url, query);
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
        return axios.get(`${getApiUrl(id, gameWeekData)}${query && query.compareUsername ? `?compareUsername=${query.compareUsername}` : ''}`)
          .then(resp => {
            const initialData = getInitialData(id, gameWeekData.sport, gameWeekData.year, gameWeekData.season, gameWeekData.week, gameWeekData.weeks, query ? query.code : null, resp.data, 'games', url, query);
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

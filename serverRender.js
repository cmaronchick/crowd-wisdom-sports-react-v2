import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './src/components/App';

import config from './config';
import axios from 'axios';

const getApiUrl = (gameId, year, gameWeek) => {
  
  if (gameId) {
    return `${config.serverUrl}/api/game/${gameId}`;
  }
  if (year && gameWeek) {
    return `${config.serverUrl}/api/games/${year}/${gameWeek}`;
  }
  return `${config.serverUrl}/api/games`;
};

const getInitialData = (gameId, apiData) => {
  if (gameId) {
    return {
      currentGameId: apiData.gameId,
      games: {
        [apiData.gameId]: apiData
      }
    };
  }
  return {
    games: apiData.games
  };
};

const serverRender = (gameId, year, gameWeek) =>
  axios.get(getApiUrl(gameId, year, gameWeek))
  .then(resp => {
    const initialData = getInitialData(gameId, resp.data);
    console.log('initialData: ', initialData);
    return {
      initialMarkup: ReactDOMServer.renderToString(
      <App initialData={initialData} />),
      initialData
    };
  });

export default serverRender;
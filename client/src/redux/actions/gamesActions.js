import { LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    SET_PREDICTIONS,
    TOGGLE_ODDS_CHART_TYPE,
    SET_ODDS_MOVEMENT,
    LOADING_ODDS_MOVEMENT,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_ODDS,
    SET_GAME_ODDS
} from '../types'

import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'
import store from '../store';
import { getCrowdResults } from './leaderboardActions'

const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/' : 'https://app.stakehousesports.com/api/'})
const AUTH_SESSION_TIMEOUT_MS = 5000

const getAuthOptions = async () => {
    try {
        const currentSession = await Promise.race([
            Auth.currentSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Auth session timeout')), AUTH_SESSION_TIMEOUT_MS))
        ])
        const IdToken = await currentSession.getIdToken().getJwtToken()
        return {
            headers: {
                Authorization: IdToken
            }
        }
    } catch (getGamesUserSessionError) {
        console.log('getGamesUserSessionError', getGamesUserSessionError)
        return {}
    }
}

const normalizeRequestError = async (error) => {
    if (error.response) {
        try {
            return await error.response.json()
        } catch (responseParseError) {
            console.log('responseParseError', responseParseError)
        }
    }

    return {
        name: error.name,
        message: error.message
    }
}

export const fetchGameWeekGames = (sport, year, season, gameWeek) => async (dispatch) => {

    dispatch({
        type: LOADING_GAMES
    })

    const getOptions = await getAuthOptions()

    try {
        console.log(`fetchGameWeekGames: ${sport}/${year}/${season}/${gameWeek}`, getOptions)
        let gameWeekGames
        try {
            gameWeekGames = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}`, getOptions).json()
        } catch (getGameWeekGamesError) {
            if (getGameWeekGamesError && getGameWeekGamesError.name === 'TimeoutError' && getOptions && getOptions.headers) {
                console.log('fetchGameWeekGames timed out with auth, retrying without auth header')
                gameWeekGames = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}`).json()
            } else {
                throw getGameWeekGamesError
            }
        }
        dispatch({
            type: SET_GAMES,
            payload: gameWeekGames
        })
        if (Object.keys(gameWeekGames).length > 0) {
            dispatch(getCrowdResults(sport, year, season, gameWeek))
            dispatch(setGamePredictions(gameWeekGames.games))
            dispatch(getWeeklyOddsMovement(sport, year, season, gameWeek))
            // window.history.pushState({ sport, year, season, gameWeek }, `${sport}: ${year} / ${season} / Week ${gameWeek}`, `/${sport}/games/${year}/${season}/${gameWeek}`)
        }


    } catch (getGameWeekGamesError) {
        const normalizedError = await normalizeRequestError(getGameWeekGamesError)
        dispatch({
            type: SET_GAMES,
            payload: {
                games: {}
            }
        })
        console.log('getGameWeekGamesError', normalizedError)
        dispatch({
            type: SET_ERRORS,
            payload: normalizedError
        })
    }
  };

  export const setGamePredictions = (games) => (dispatch) => {
      let gamePredictions = {}
      Object.keys(games).forEach(gameId => {
        let prediction = games[gameId].prediction
        if (prediction) {
            gamePredictions[gameId] = {
                ...prediction
            }
        }
    })
      dispatch({
          type: SET_PREDICTIONS,
          payload: {
              type: 'user',
              name: store.getState().user.attributes.preferred_username,
              ...gamePredictions
          }
      })
  }

  export const fetchGame = (sport, year, season, gameWeek, gameId, compareUsername) => async (dispatch) => {
    dispatch({
        type: LOADING_GAME
    })
    const getOptions = await getAuthOptions()

    try {
        let getGameResponse = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}/game/${gameId}`, getOptions).json()
        getGameResponse.game.oddsChartType = 'spread'
        // console.log('getGameResponse', getGameResponse)
        dispatch({
            type: SET_GAME,
            payload: getGameResponse
        })
        if (store.getState().games.loadingGames) {
            dispatch(fetchGameWeekGames(sport, year, season, gameWeek))
        }
    } catch (getGameError) {
        const normalizedError = await normalizeRequestError(getGameError)
        console.log('getGameError', normalizedError)
        dispatch({
            type: SET_GAME,
            payload: {}
        })
        dispatch({
            type: SET_ERRORS,
            payload: normalizedError
        })
    }
    // return apiHost.get(`/api/${sport}/games/${year}/${season}/${gameWeek}/${gameId}${compareUsername ? `?compareUsername=${compareUsername}` : ''}`, getOptionsObj.callOptions)
    // .then(resp => resp.data);
  }

  export const toggleOddsChartType = () => (dispatch) => {
      dispatch({
          type: TOGGLE_ODDS_CHART_TYPE
      })
  }

  export const getWeeklyOddsMovement = (sport, year, season, week) => async (dispatch) => {
      dispatch({
          type: LOADING_ODDS_MOVEMENT
      })
      try {
          const oddsMovement = await apiHost.get(`${sport}/games/${year}/${season}/${week}/live`).json()
          console.log('oddsMovement', oddsMovement)
          
          dispatch({
              type: SET_ODDS_MOVEMENT,
              payload: oddsMovement.games?.Items ? oddsMovement.games.Items.reduce((acc, game) => {
                  acc[game.gameId] = game;
                  return acc;
              }, {}) : []
          })
      } catch (getOddsMovementError) {
          console.log('getOddsMovementError', getOddsMovementError)
      }
  }

  export const fetchCurrentLines = (sport, year, season, gameWeek, gameId, awayTeamId, homeTeamId) => async (dispatch) => {
    console.log('fetchCurrentLines', sport, year, season, gameWeek, gameId, awayTeamId, homeTeamId)
      dispatch({
          type: LOADING_ODDS,
          payload: {
              gameId
          }
      })
      if (!awayTeamId || !homeTeamId) {
          return;
      }
      try {
          let getOptions = {}
          try {
              let currentSession = await Auth.currentSession()
              let IdToken = await currentSession.getIdToken().getJwtToken()
              getOptions = {
                  headers: {
                      Authorization: IdToken
                  }
              }
          } catch (authError) {
              // Ignore auth error for anonymous view if applicable
          }
          
          let getCurrentLinesResponseJSON = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}/game/${gameId}/currentlines?awayTeamId=${awayTeamId}&homeTeamId=${homeTeamId}`, getOptions).json()
                                                            //'/:sport/games/:year/:season/:gameWeek/game/:gameId/currentlines'
          
          let gameOdds = { ...store.getState().games.games }
          let gameObj = {}
          if (gameOdds[gameId]) {
              gameOdds[gameId] = { ...gameOdds[gameId], currentLines: getCurrentLinesResponseJSON.lines }
              gameObj = gameOdds[gameId]
          }
          dispatch({
              type: SET_GAME_ODDS,
              payload: {
                  games: gameOdds,
                  gameId: gameId,
                  currentLines: getCurrentLinesResponseJSON.lines
              }
          })
          return gameObj
      } catch (getCurrentLinesError) {
          console.log('getCurrentLinesError', gameId, getCurrentLinesError)
          dispatch({
              type: SET_ERRORS,
              payload: getCurrentLinesError
          })
      }
  }
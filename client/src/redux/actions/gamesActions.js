import { LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    LOADING_PREDICTIONS,
    SET_PREDICTIONS,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'
import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'

const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})


export const fetchGameWeekGames = (sport, year, season, gameWeek) => async (dispatch) => {
    console.log('sport, year, season, gameWeek', sport, year, season, gameWeek)
    dispatch({
        type: LOADING_GAMES
    })

    let currentSession, IdToken;
    let getOptions = {};
    try {
        currentSession = await Auth.currentSession()
        IdToken = await currentSession.getIdToken().getJwtToken()
        getOptions = {
            headers: {
                Authorization: IdToken
            }
        }
    } catch (getGamesUserSessionError) {
        console.log('getGamesUserSessionError', getGamesUserSessionError)
    }
    try {
        let gameWeekGames = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}`, getOptions).json()
        dispatch({
            type: SET_GAMES,
            payload: gameWeekGames
        })
        dispatch(setGamePredictions(gameWeekGames.games))


    } catch (getGameWeekGamesError) {
        console.log('getGameWeekGamesError', getGameWeekGamesError)
        dispatch({
            type: SET_GAMES,
            games: {}
        })
        dispatch({
            type: SET_ERRORS,
            errors: getGameWeekGamesError
        })
    }
  };

  export const setGamePredictions = (games) => (dispatch) => {
      let gamePredictions = {}
      Object.keys(games).forEach(gameId => {
          let prediction = games[gameId].prediction
          if (prediction) {
              gamePredictions[gameId] = {
                  predictionAwayTeamScore: prediction.awayTeam.score,
                  predictionHomeTeamScore: prediction.homeTeam.score
              }
          }
      })
      dispatch({
          type: SET_PREDICTIONS,
          payload: gamePredictions
      })
  }

  export const fetchGame = (sport, year, season, gameWeek, gameId, compareUsername) => async (dispatch) => {
    dispatch({
        type: LOADING_GAME
    })
    let currentSession, IdToken;
    let getOptions = {};
    try {
        currentSession = await Auth.currentSession()
        IdToken = await currentSession.getIdToken().getJwtToken()
        getOptions = {
            headers: {
                Authorization: IdToken
            }
        }
    } catch (getGamesUserSessionError) {
        console.log('getGamesUserSessionError', getGamesUserSessionError)
    }

    try {
        let getGameResponse = await apiHost.get(`${sport}/games/${year}/${season}/${gameWeek}/game/${gameId}${!currentSession ? `/anon` : ''}`, getOptions).json()
        console.log('getGameResponse', getGameResponse)
        dispatch({
            type: SET_GAME,
            payload: getGameResponse
        })
    } catch (getGameError) {
        console.log('getGameError', getGameError)
        if (getGameError.response) {
            getGameError = await getGameError.response.json()
        }
        console.log('getGameError', getGameError)
        dispatch({
            type: SET_GAME,
            payload: {}
        })
        dispatch({
            type: SET_ERRORS,
            errors: getGameError
        })
    }
    // return apiHost.get(`/api/${sport}/games/${year}/${season}/${gameWeek}/${gameId}${compareUsername ? `?compareUsername=${compareUsername}` : ''}`, getOptionsObj.callOptions)
    // .then(resp => resp.data);
  }
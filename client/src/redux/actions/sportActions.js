import {
    SET_SPORT,
    SET_GAMEWEEK,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'
import { fetchGameWeekGames, fetchGame } from './gamesActions'

import ky from 'ky/umd'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})

export const setSport = (sport) => (dispatch) => {
    sport = sport ? sport : 'nfl'
    dispatch({
        type: SET_SPORT,
        payload: sport
    })
    dispatch(setGameWeek(sport))
}

export const setGameWeek = (sport) => async (dispatch) => {
    try {
        let gameWeekData = await apiHost.get(`${sport}/week`).json()
        dispatch({
            type: SET_GAMEWEEK,
            payload: gameWeekData.data
        })
        const { week, year, season } = gameWeekData.data
        if (window.location.pathname.indexOf('/game/') > -1) {
          let attributes = window.location.pathname.split('/')
          const sport = attributes[1];
          const year = attributes[3];
          const season = attributes[4];
          const gameWeek = attributes[5];
          const gameId = attributes[7];
          console.log('gameId', gameId)
          if (!gameId) {
            console.log('missing attribute')
            window.history.pushState({ title: 'redirect'},'/')
            dispatch(fetchGameWeekGames(sport, year, season, week))
          } else {
            dispatch(fetchGame(sport, year, season, week, gameId))
          }
        } else {
            dispatch(fetchGameWeekGames(sport, year, season, week))
        }
    } catch (getGameWeekError) {
        console.log('getGameWeekError', getGameWeekError)
        if (getGameWeekError.response) {
            let getGameWeekErrorJSON = await getGameWeekError.response.json()

            dispatch({
                type: SET_ERRORS,
                errors: getGameWeekErrorJSON
            })
        } else {
            dispatch({
                type: SET_ERRORS,
                errors: getGameWeekError
            })
        }
    }
    // dispatch({
    //     type: 
    // })
}

export const changeGameWeek = (gameWeekData, selectedWeek) => (dispatch) => {

    dispatch({
        type: SET_GAMEWEEK,
        payload: {
            ...gameWeekData,
            week: selectedWeek
        }
    })
}
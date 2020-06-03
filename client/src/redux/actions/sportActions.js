import {
    SET_SPORT,
    SET_GAMEWEEK,
    SET_SEASON,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'
import { fetchGameWeekGames, fetchGame } from './gamesActions'

import ky from 'ky/umd'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})

const validSeasons = ['pre','reg', 'post']
const validYears = [2018, 2019, 2020]
const validSports = ['nfl', 'ncaaf', 'ncaam']
export const setSport = (sport, year, season, week) => (dispatch) => {
    //validate URL parameters - Sport
    sport = sport && validSports.indexOf(sport) > -1 ? sport : 'nfl';
    dispatch({
        type: SET_SPORT,
        payload: sport
    })
    dispatch(setGameWeek(sport, year, season, week))
}

export const setGameWeek = (sport, selectedYear, selectedSeason, selectedWeek) => async (dispatch) => {
    // selectedYear and selectedSeason are both validated to ensure mistyped URLs still work
    try {
        let gameWeekData = await apiHost.get(`${sport}/week`).json()
        if (selectedYear && validYears.indexOf(selectedYear) > -1) {
            gameWeekData.data.year = selectedYear;
        }
        if (selectedSeason && validSeasons.indexOf(selectedSeason) > -1) {
            // If the season in the current URL does not match the default season
            // update the season data with the selected season
            if (selectedSeason !== gameWeekData.data.season) {
                dispatch(selectSeason(sport, selectedYear, selectedSeason))
            }
            gameWeekData.data.season = selectedSeason;
        }
        if (selectedWeek) {
            gameWeekData.data.week = selectedWeek
        }
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

export const selectSeason = (sport, year, season) => async (dispatch) => {
    console.log('sport, year, season', sport, year, season)
    try {
        let seasonDetailsResponse = await apiHost.get(`${sport}/${year}/${season}`).json()
        console.log('seasonDetailsResponse', seasonDetailsResponse)
        
        dispatch({
            type: SET_SEASON,
            payload: {
                sport,
                year,
                season,
                week: 1,
                weeks: seasonDetailsResponse.data.weeks
            }
        })
        dispatch(fetchGameWeekGames(sport, year, season, 1))

    } catch(setSeasonError) {

    }
}
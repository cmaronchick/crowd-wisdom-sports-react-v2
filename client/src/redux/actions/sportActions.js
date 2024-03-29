import {
    SET_SPORT,
    SET_GAMEWEEK,
    SET_SEASON,
    SET_ERRORS
} from '../types'
import { fetchGameWeekGames, fetchGame } from './gamesActions'
import { getCrowdResults, fetchLeaderboards } from './leaderboardActions'
import { Auth } from 'aws-amplify'
import { getUserDetails } from './userActions'

import ky from 'ky/umd'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/' : 'https://app.stakehousesports.com/api/'})

const validSeasons = ['pre','reg', 'post']
const validYears = [2018, 2019, 2020]
const validSports = ['nfl', 'ncaaf', 'ncaam']
export const setSport = (sport, year, season, week) => (dispatch) => {
    //validate URL parameters - Sport
    sport = sport && sport !== '' && validSports.indexOf(sport) > -1 ? sport : 'nfl';
    dispatch({
        type: SET_SPORT,
        payload: sport
    })
    console.log(`sport, year, season, week`, sport, year, season, week)
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
        let { week, year, season } = gameWeekData.data
        try {
            const user = await Auth.currentAuthenticatedUser()

            const extendedProfile = dispatch(getUserDetails(sport, year, season, week))
            // console.log('extendedProfile', extendedProfile)
        } catch (sportActionsGetUserError) {
            console.log('no authenticated user')
        }
        if (window.location.pathname.indexOf('/game/') > -1) {
          let attributes = window.location.pathname.split('/')
          const sport = attributes[1];
          year = attributes[3];
          season = attributes[4];
          week = attributes[5];
          const gameId = attributes[7];
          console.log('gameId', gameId)
          if (!gameId) {
            console.log('missing attribute')
            window.history.pushState({ title: 'redirect'},'/')
            dispatch(fetchGameWeekGames(sport, year, season, week))
            dispatch(getCrowdResults(sport, year, season, week))

          } else {
            dispatch(fetchGame(sport, year, season, week, gameId))
          }
        } else {
            // console.log('fetching games')
            dispatch(fetchGameWeekGames(sport, year, season, week))
            dispatch(getCrowdResults(sport, year, season, week))
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
        let seasonDetailsResponse = await apiHost.get(`sport/${sport}/${year}/${season}`).json()
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
        dispatch(fetchLeaderboards(sport, year, season, 1))

    } catch(setSeasonError) {

    }
}
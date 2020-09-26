import { Auth } from '@aws-amplify/auth'
//import { apiHost } from '../../constants/config'
import ky from 'ky/umd'
import { LOADING_LEADERBOARDS,
    SET_LEADERBOARDS,
    SELECT_LEADERBOARD_TYPE,
    SET_ERRORS,
    CLEAR_ERRORS } from '../types'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://app.stakehousesports.com/api/'})

export const fetchLeaderboards = (sport, year, season, week) => async (dispatch) => {
    dispatch({
        type: LOADING_LEADERBOARDS
    })
    try {
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let leaderboardResponse = await apiHost.get(`${sport}/leaderboards/${year}/${season}/${week}`, IdToken ? {
            headers: {
                Authorization: IdToken
            }
        } : {}).json()
        console.log('leaderboardResponse', leaderboardResponse)
        dispatch({
            type: SET_LEADERBOARDS,
            payload: leaderboardResponse.leaderboards
        })
        dispatch({
            type: CLEAR_ERRORS
        })
    } catch (fetchLeaderboardsError) {
        console.log('fetchLeaderboardsError', fetchLeaderboardsError)
        dispatch({
            type: SET_ERRORS,
            errors: fetchLeaderboardsError
        })
    }
}

export const selectLeaderboardType = (leaderboardType) => (dispatch) => {
    dispatch({
        type: SELECT_LEADERBOARD_TYPE,
        payload: leaderboardType
    })

}
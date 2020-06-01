import { Auth } from '@aws-amplify/auth'
//import { apiHost } from '../../constants/config'
import ky from 'ky/umd'
import { LOADING_LEADERBOARDS, SET_LEADERBOARDS, SET_ERRORS, CLEAR_ERRORS } from '../types'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})

export const fetchLeaderboards = (sport, year, season, week) => async (dispatch) => {
    console.log('sport, year, season, week', sport, year, season, week)
    dispatch({
        type: LOADING_LEADERBOARDS
    })
    try {
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let leaderboardResponse = await apiHost.get(`${sport}/leaderboards/${year}/${season}/${week}${!IdToken ? '/anon' : ''}`, IdToken ? {
            headers: {
                Authorization: IdToken
            }
        } : {}).json()
        // console.log('leaderboardResponse', leaderboardResponse.leaderboards)
        dispatch({
            type: SET_LEADERBOARDS,
            payload: leaderboardResponse.leaderboards
        })
    } catch (fetchLeaderboardsError) {
        console.log('fetchLeaderboardsError', fetchLeaderboardsError)
        dispatch({
            type: SET_ERRORS,
            errors: fetchLeaderboardsError
        })
    }
}
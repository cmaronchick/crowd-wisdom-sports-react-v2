import { Auth } from '@aws-amplify/auth'
//import { apiHost } from '../../constants/config'
import ky from 'ky/umd'
import store from '../store'
import { LOADING_LEADERBOARDS, SET_LEADERBOARDS, SET_ERRORS, CLEAR_ERRORS } from '../types'
const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})

export const fetchLeaderboards = async (sport, year, season, week) => {
    try {
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let leaderboardResponse = await apiHost.get(`${sport}/leaderboards/${year}/${season}/${week}`, IdToken ? {
            headers: {
                Authorization: IdToken
            }
        } : {}).json()
        
        return {
            type: SET_LEADERBOARDS,
            payload: leaderboardResponse.leaderboards
        }
    } catch (fetchLeaderboardsError) {
        console.log('fetchLeaderboardsError', fetchLeaderboardsError)
        return {
            type: SET_ERRORS,
            errors: fetchLeaderboardsError
        }
    }
}
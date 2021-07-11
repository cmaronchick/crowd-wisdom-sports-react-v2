import {
    LOADING_LEADERBOARDS,
    SET_LEADERBOARDS,
    SELECT_LEADERBOARD_TYPE,
    LOADING_CROWD_RESULTS,
    SET_CROWD_RESULTS
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    leaderboards: {},
    leaderboardType: 'predictionScore',
    loadingLeaderboards: false
}


export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_LEADERBOARDS:
            return { 
                ...state,
                loadingLeaderboards: true
            }
        case SET_LEADERBOARDS:
            return { 
                ...state,
                leaderboards: {...action.payload},
                loadingLeaderboards: false
            }
        case SELECT_LEADERBOARD_TYPE: 
            return {
                ...state,
                leaderboardType: action.payload
            }
        case SET_CROWD_RESULTS:
            return {
                ...state,
                crowd: {
                    ...action.payload.crowd
                }
            }
        default: 
            return {
                ...state
            }
    }
}
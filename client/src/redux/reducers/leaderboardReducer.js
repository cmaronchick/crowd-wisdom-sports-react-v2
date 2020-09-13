import {
    LOADING_LEADERBOARDS,
    SET_LEADERBOARDS,
    SELECT_LEADERBOARD_TYPE
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
        default: 
            return {
                ...state
            }
    }
}
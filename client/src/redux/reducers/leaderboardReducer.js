import {
    LOADING_LEADERBOARDS,
    SET_LEADERBOARDS
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    leaderboards: {},
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
            console.log('action.payload', action.payload)
            return { 
                ...state,
                leaderboards: {...action.payload},
                loadingLeaderboards: false
            }
        default: 
            return {
                ...state
            }
    }
}
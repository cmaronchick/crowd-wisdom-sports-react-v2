import {
    SET_SPORT,
    SET_GAMEWEEK,
    SET_SEASON
    } from '../types'


const initialState = {
    sport: null,
    gameWeekData: {},
    loadingSport: true
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_SPORT:
            return {
                ...state,
                sport: action.payload
            }
        case SET_GAMEWEEK:
            return {
                ...state,
                sport: action.payload.sport,
                gameWeekData: {
                    ...action.payload
                },
                loadingSport: false
            }
        case SET_SEASON: 
            return {
                ...state,
                gameWeekData: {
                    ...action.payload
                }

            }
        default:
            return {
                ...state
            }
    }
}
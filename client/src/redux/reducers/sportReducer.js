import {
    SET_SPORT,
    SET_GAMEWEEK,
    SET_SEASON,
    SET_SPORTSBOOKS
    } from '../types'


const initialState = {
    sport: null,
    gameWeekData: {},
    loadingSport: true,
    sportsbooks: []
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
                sport: action.payload.sport ? action.payload.sport : state.sport,
                gameWeekData: {
                    ...action.payload
                },
                loadingSport: false
            }
        case SET_SEASON: 
            return {
                ...state,
                sport: action.payload.sport ? action.payload.sport : state.sport,
                gameWeekData: {
                    ...action.payload
                }

            }
        case SET_SPORTSBOOKS:
            return {
                ...state,
                sportsbooks: action.payload.sportsbooks ? action.payload.sportsbooks : state.sportsbooks
            }
        default:
            return {
                ...state
            }
    }
}
import {
    SET_SPORT,
    SET_GAMEWEEK
    } from '../types'


const initialState = {
    sport: null,
    gameWeekData: {}
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
                }
            }
        default:
            return {
                ...state
            }
    }
}
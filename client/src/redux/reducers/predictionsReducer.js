import {
    LOADING_PREDICTIONS,
    LOADING_GROUP_PREDICTIONS,
    LOADING_COMPARED_USER_PREDICTIONS,
    SET_PREDICTIONS,
    SET_GROUP_PREDICTIONS,
    SET_COMPARED_USER_PREDICTIONS
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    user: {},
    group: {},
    comparedUser: {},
    loadingUserPredictions: false,
    loadingGroupPredictions: false,
    loadingComparedUserPredictions: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_PREDICTIONS:
            return {
                ...state,
                loadingUserPredictions: true
            }
        case LOADING_GROUP_PREDICTIONS:
            return {
                ...state,
                loadingGroupPredictions: true
            }
        case LOADING_COMPARED_USER_PREDICTIONS:
            return {
                ...state,
                loadingGroupPredictions: true
            }
        case SET_PREDICTIONS:
            return {
                ...state,
                user: {
                    ...action.payload
                },
                loadingUserPredictions: false
            }
        case SET_COMPARED_USER_PREDICTIONS:
            return {
                ...state,
                comparedUser: {
                    ...action.payload
                },
                loadingComparedUserPredictions: false
            }
        case SET_GROUP_PREDICTIONS:
            return {
                ...state,
                group: {
                    ...action.payload
                },
                loadingGroupPredictions: false
            }
        default:
            return {
                ...state
            }
    }
}
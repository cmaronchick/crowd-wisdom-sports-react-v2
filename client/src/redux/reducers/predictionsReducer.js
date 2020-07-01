import {
    LOADING_PREDICTIONS,
    LOADING_GROUP_PREDICTIONS,
    LOADING_COMPARED_USER_PREDICTIONS,
    SET_PREDICTIONS,
    SET_GROUP_PREDICTIONS,
    SET_COMPARED_USER_PREDICTIONS,
    CHANGE_GAME_SCORE
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
        case CHANGE_GAME_SCORE:
            let changeGameScorePrediction, changeGameScoreTotal, changeGameScoreSpread;
            if (state.user[action.payload.gameId]) {
                changeGameScorePrediction = {
                    ...state.user[action.payload.gameId],
                    [action.payload.name]: {
                        score: action.payload.value
                    }
                }
                if (action.payload.name === 'awayTeam') {
                    changeGameScoreTotal = changeGameScorePrediction.homeTeam.score + action.payload.value
                    changeGameScoreSpread = changeGameScorePrediction.homeTeam.score - action.payload.value
                } else {
                    changeGameScoreTotal = changeGameScorePrediction.awayTeam.score + action.payload.value
                    changeGameScoreSpread = action.payload.value - changeGameScorePrediction.awayTeam.score
                }
            } else {
                changeGameScorePrediction = {
                    [action.payload.name]: {
                        score: action.payload.value
                    },
                    total: action.payload.value,
                    spread: action.payload.name === 'awayTeam' ? action.payload.value : action.payload.value * -1
                }
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    [action.payload.gameId]: {
                        ...[action.payload.gameId],
                        ...action.payload

                    }
                }
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
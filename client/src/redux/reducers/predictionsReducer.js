import {
    LOADING_PREDICTIONS,
    LOADING_GROUP_PREDICTIONS,
    LOADING_COMPARED_USER_PREDICTIONS,
    SET_PREDICTIONS,
    SET_GROUP_PREDICTIONS,
    SET_COMPARED_USER_PREDICTIONS,
    CHANGE_GAME_SCORE,
    CHANGE_GAME_STAKES,
    SUBMITTING_PREDICTION,
    SUBMITTED_PREDICTION,
    GETTING_COMPARED_USER_PREDICTIONS,
    SET_WAGERS,
    ADD_WAGER,
    LOADING_WAGERS
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    user: {},
    group: {},
    comparedUser: {
        gettingPredictions: false,
        predictions: null
    },
    wagers: null,
    loadingUserPredictions: false,
    loadingGroupPredictions: false,
    loadingComparedUserPredictions: false,
    loadingWagers: false
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
            let changeGameScorePrediction;
            if (state.user[action.payload.gameId]) {
                changeGameScorePrediction = {
                    ...state.user[action.payload.gameId],
                    [action.payload.name]: {
                        score: action.payload.value
                    }
                }
                // if the new prediction is the away team,
                // calculate using the existing home team score
                // and vice versa

                if (action.payload.name === 'awayTeam') {
                    changeGameScorePrediction.total = changeGameScorePrediction.homeTeam ? changeGameScorePrediction.homeTeam.score + action.payload.value : action.payload.value
                    changeGameScorePrediction.spread = changeGameScorePrediction.homeTeam ? action.payload.value - changeGameScorePrediction.homeTeam.score  : action.payload.value
                } else {
                    changeGameScorePrediction.total = changeGameScorePrediction.awayTeam ? changeGameScorePrediction.awayTeam.score + action.payload.value : action.payload.value
                    changeGameScorePrediction.spread = changeGameScorePrediction.awayTeam ? changeGameScorePrediction.awayTeam.score - action.payload.value : action.payload.value
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
                        ...changeGameScorePrediction,
                        submitted: false

                    }
                }
            }
        case CHANGE_GAME_STAKES:
            let changeGameStakesPrediction;
            changeGameStakesPrediction = {
                ...state.user[action.payload.gameId],
                stars: {
                    ...state.user[action.payload.gameId].stars,
                    [action.payload.name]: action.payload.value
                }
            }
            return {
                ...state,
                user: {
                    ...state.user,
                    [action.payload.gameId]: {
                        ...changeGameStakesPrediction,
                        submitted: false

                    }
                }
            }
        case SUBMITTING_PREDICTION:
            return {
                ...state,
                user: {
                    ...state.user,
                    [action.payload.gameId]: {
                        ...state.user[action.payload.gameId],
                        submitting: true
                    }
                }
            }
        case SUBMITTED_PREDICTION:
            return {
                ...state,
                user: {
                    ...state.user,
                    [action.payload.gameId]: {
                        ...state.user[action.payload.gameId],
                        submitting: false,
                        submitted: true
                    }
                }
            }
        case GETTING_COMPARED_USER_PREDICTIONS:
            return {
                ...state,
                comparedUser: {
                    gettingPredictions: true,
                    predictions: null
                },
                loadingComparedUserPredictions: false
            }

        case SET_COMPARED_USER_PREDICTIONS:
            return {
                ...state,
                comparedUser: {
                    gettingPredictions: false,
                    predictions: action.payload
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
        case SET_WAGERS:
            return {
                ...state,
                wagers: action.payload,
                loadingWagers: false
            }
        case ADD_WAGER:
            return {
                ...state,
                wagers: state.wagers ? [
                    ...state.wagers,
                    action.payload
                ] : [action.payload]
            }
        case LOADING_WAGERS:
            return {
                ...state,
                loadingWagers: true
            }
        default:
            return {
                ...state
            }
    }
}
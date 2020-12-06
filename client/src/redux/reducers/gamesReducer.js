import {
    LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    LOADING_PREDICTIONS,
    SET_PREDICTIONS,
    TOGGLE_ODDS_CHART_TYPE,
    SET_ODDS_MOVEMENT
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    games: {},
    gamePredictions: {},
    game: {},
    oddsMovement: [],
    gameResults: 0,
    loadingGames: false,
    loadingGame: false,
}


export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_GAMES:
            return {
                ...state,
                loadingGames: true
            }
        case SET_GAMES:
            return {
                ...state,
                ...action.payload,
                loadingGames: false
            }
        case LOADING_GAME:
            return {
                ...state,
                loadingGame: true
            }
        case SET_GAME:
            return {
                ...state,
                ...action.payload,
                loadingGame: false
            }
        case TOGGLE_ODDS_CHART_TYPE:
            return {
                ...state,
                game: {
                    ...state.game,
                    oddsChartType: state.game.oddsChartType === 'spread' ? 'total' : 'spread'
                }

            }
        case SET_ODDS_MOVEMENT:
            action.payload.sort((a,b) => {
                return new Date(a.startDateTime) > new Date(b.startDateTime) ? 1 : -1
            })
            return {
                ...state,
                oddsMovement: action.payload
            }
        default:
            return {
                ...state
            }
    }
}
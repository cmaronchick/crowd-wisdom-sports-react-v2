import {
    LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    TOGGLE_ODDS_CHART_TYPE
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    games: {},
    gamePredictions: {},
    game: {},
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
        default:
            return {
                ...state
            }
    }
}
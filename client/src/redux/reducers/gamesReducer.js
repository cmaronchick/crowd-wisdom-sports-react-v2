import {
    LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    LOADING_PREDICTIONS,
    SET_PREDICTIONS,
    TOGGLE_ODDS_CHART_TYPE,
    SET_ODDS_MOVEMENT,
    LOADING_ODDS_MOVEMENT
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    games: {},
    gamePredictions: {},
    game: {},
    oddsMovement: [],
    gameResults: 0,
    loadingGames: true,
    loadingGame: true,
    loadingOdds: true,
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
            const gamesState = action.payload.game ? {
                ...state.games,
                [action.payload.game.gameId]: {...action.payload.game}
            } : { ...state.games }
            return {
                ...state,
                games: gamesState,
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
        case LOADING_ODDS_MOVEMENT:
            return {
                ...state,
                loadingOdds: true
            }
        case SET_ODDS_MOVEMENT:
            action.payload.sort((a,b) => {
                return new Date(a.startDateTime) > new Date(b.startDateTime) ? 1 : -1
            })
            return {
                ...state,
                oddsMovement: action.payload,
                loadingOdds: false
            }
        default:
            return {
                ...state
            }
    }
}
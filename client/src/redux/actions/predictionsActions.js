import { 
    CHANGE_GAME_SCORE,
    CHANGE_GAME_STAKES,
    SET_ERRORS,
    SUBMITTING_PREDICTION,
    SUBMITTED_PREDICTION,
    GETTING_COMPARED_USER_PREDICTIONS,
    SET_COMPARED_USER_PREDICTIONS,
    LOADING_WAGERS,
    SET_WAGERS,
    ADD_WAGER
} from '../types'

import { fetchGame } from './gamesActions'

import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'
import ReactGA from 'react-ga4'

const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/' : 'https://app.stakehousesports.com/api/'})

export const changeGameScore = (gameId, event) => (dispatch) => {
    const { name, value } = event.target
    dispatch({
        type: CHANGE_GAME_SCORE,
        payload: {
            gameId,
            name,
            value: parseInt(value) ? parseInt(value) : ''
        }
    })
}

export const changeStakesValue = (gameId, stakeType, value) => (dispatch) => {
    dispatch({
        type: CHANGE_GAME_STAKES,
        payload: {
            gameId,
            name: stakeType,
            value: parseInt(value)
        }
    })
}

export const submitPrediction = (gameId, prediction) => async (dispatch) => {
    console.log('prediction', prediction)
    dispatch({
        type: SUBMITTING_PREDICTION,
        payload: {
            gameId
        }
    })
    try {
        let currentSession = await Auth.currentSession();
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let predictionResponse = await apiHost.post('submitPrediction', {
            headers: {
                Authorization: IdToken,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(prediction)
        })
        console.log('event sent :>> ', gameId);
        ReactGA.event({
          category: 'prediction',
          action: 'submitted',
          label: 'success',
          value: gameId
        })
        dispatch({
            type: SUBMITTED_PREDICTION,
            payload: {
                gameId,
                prediction
            }
        })
        const { sport, year, season, gameWeek } = prediction
        dispatch(fetchGame(sport, year, season, gameWeek, gameId))
    } catch (submitPredictionError) {
        console.log('submitPredictionError', submitPredictionError)

        dispatch({
            type: SUBMITTED_PREDICTION,
            payload: {
                gameId,
                prediction
            }
        })

        dispatch({
            type: SET_ERRORS,
            payload: submitPredictionError
        })
    }
}


export const getUserPredictions = (sport, year, season, gameWeek, userId) => async (dispatch) => {
    console.log(`sport, year, season, gameWeek, userId`, sport, year, season, gameWeek, userId)
    dispatch({
        type: GETTING_COMPARED_USER_PREDICTIONS
    })
    try {
        let currentSession = await Auth.currentSession();
        let userPredictionResponse = await apiHost.get(`user/predictions?sport=${sport}&year=${year}&season=${season}&week=${gameWeek}&userId=${userId}`)
        let userPredictionResponseJSON = await userPredictionResponse.json()
        console.log(`userPredictionResponseJSON`, userPredictionResponseJSON)
        ReactGA.event({
          category: 'prediction',
          action: 'getAll',
          label: userId
        })
        dispatch({
            type: SET_COMPARED_USER_PREDICTIONS,
            payload: userPredictionResponseJSON.userPredictions
        })
    } catch (submitPredictionError) {
        console.log('submitPredictionError', submitPredictionError)

        dispatch({
            type: SET_COMPARED_USER_PREDICTIONS,
            payload: []
        })

        dispatch({
            type: SET_ERRORS,
            payload: submitPredictionError
        })
    }
}

export const submitWager = (game, prediction, wager) => async (dispatch) => {
    if (!game || Object.keys(wager).length === 0) {
        dispatch({
            type: SET_ERRORS,
            payload: 'Sorry, there was an issue submitting your wager.'
        })
        return;
    }
    const { gameId, year, sport, gameWeek, season, awayTeam, homeTeam, odds} = game
    const wagerObject = {
        gameId,
        year,
        sport,
        gameWeek,
        season,
        prediction: {
            ...prediction,
            awayTeam: {
                ...prediction.awayTeam,
                ...awayTeam
            },
            homeTeam: {
                ...prediction.homeTeam,
                ...homeTeam
            }
        },
        wager,
        odds,
        submitted: Date.now()
    }
    try {
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let userWagerResponse = await apiHost.post('predictions/wager', {
            headers: {
                Authorization: IdToken,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(wagerObject)
        })
        let userWagerResponseJSON = await userWagerResponse.json()
        if (userWagerResponseJSON.errorType) {
            return userWagerResponseJSON
        }
        if (userWagerResponseJSON.status === 200) {
            dispatch({
                type: ADD_WAGER,
                payload: wagerObject
            })
            return userWagerResponseJSON
        }
    } catch (wagerError) {
        console.error(wagerError)
        dispatch({
            type: SET_ERRORS,
            payload: wagerError
        })
    }
}

export const fetchWagers = ({ sport, year, season, week, gameId }) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_WAGERS })
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        
        let fetchWagerResponse = await apiHost.get(`predictions/wager?sport=${sport ? sport : ''}&year=${year ? year : ''}&season=${season ? season : ''}&gameWeek=${week ? week : ''}&gameId=${gameId ? gameId : ''}`, {
            headers: {
                Authorization: IdToken
            }
        })
        let fetchWagerResponseJSON = await fetchWagerResponse.json()
        if (fetchWagerResponseJSON.errorType) {
            return fetchWagerResponseJSON
        }
        if (fetchWagerResponseJSON.status === 200) {
            dispatch({
                type: SET_WAGERS,
                payload: fetchWagerResponseJSON.wagers
            })
            return { wagers: fetchWagerResponseJSON.wagers, status: 200 }
        }
    } catch (wagerError) {
        console.error(wagerError)
        dispatch({
            type: SET_ERRORS,
            payload: wagerError
        })
    }
}
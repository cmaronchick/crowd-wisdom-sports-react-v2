import { LOADING_GAMES,
    SET_GAMES,
    LOADING_GAME,
    SET_GAME,
    LOADING_PREDICTIONS,
    LOADING_COMPARED_USER_PREDICTIONS,
    CHANGE_GAME_SCORE,
    CHANGE_GAME_STAKES,
    SET_PREDICTIONS,
    SET_ERRORS,
    CLEAR_ERRORS,
    SUBMITTING_PREDICTION,
    SUBMITTED_PREDICTION
} from '../types'

import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'
import store from '../store';

const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://app.stakehousesports.com/api/'})

export const changeGameScore = (gameId, event) => (dispatch) => {
    const { name, value } = event.target
    dispatch({
        type: CHANGE_GAME_SCORE,
        payload: {
            gameId,
            name,
            value: parseInt(value)
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
        dispatch({
            type: SUBMITTED_PREDICTION,
            payload: {
                gameId,
                prediction
            }
        })
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
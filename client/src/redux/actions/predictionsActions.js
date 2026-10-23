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
    ADD_WAGER,
    SUBMITTING_SURVIVOR_PICK,
    SUBMITTED_SURVIVOR_PICK,
    SET_SURVIVOR_PICK_ERROR,
    CLEAR_SURVIVOR_PICK_ERROR,
    SUBMITTING_TEASER,
    SUBMITTED_TEASER,
    SET_TEASER_ERROR,
    CLEAR_TEASER_ERROR
} from '../types'

import { fetchGame } from './gamesActions'

import { Auth } from '@aws-amplify/auth'
import ky from 'ky/umd'
import ReactGA from 'react-ga4'

const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api/' : 'https://app.stakehousesports.com/api/'})
const AUTH_SESSION_TIMEOUT_MS = 5000

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
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let userPredictionResponse = await apiHost.get(`user/predictions?sport=${sport}&year=${year}&season=${season}&week=${gameWeek}&userId=${userId}`,{
            headers: {
                Authorization: IdToken,
                'Content-type': 'application/json'
            }
        }) 
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

export const submitSurvivorPick = (pick) => async (dispatch) => {
    try {
        dispatch({ type: SUBMITTING_SURVIVOR_PICK })
        const currentSession = await Auth.currentSession()
        const IdToken = await currentSession.getIdToken().getJwtToken()
        const response = await apiHost.post('predictions/survivorpick', {
            headers: {
                'Content-type': 'application/json',
                Authorization: IdToken
            },
            body: JSON.stringify(pick)
        })
        const responseJSON = await response.json()
        dispatch({
            type: SUBMITTED_SURVIVOR_PICK,
            payload: pick
        })
        dispatch({
            type: CLEAR_SURVIVOR_PICK_ERROR
        })
        return responseJSON
    } catch (error) {
        dispatch({
            type: SET_SURVIVOR_PICK_ERROR,
            payload: { error: `${error}` }
        })
        throw error
    }
}

export const submitTeaser = (selections, teaser) => async (dispatch) => {
    if (!selections || selections.length === 0 || !teaser || Object.keys(teaser).length === 0) {
        dispatch({
            type: SET_TEASER_ERROR,
            payload: 'Sorry, there was an issue submitting your teaser.'
        })
        return false
    }

    dispatch({ type: SUBMITTING_TEASER })
    dispatch({ type: CLEAR_TEASER_ERROR })

    const predictionsArray = selections.map((selection) => ({
        awayTeam: selection.prediction?.awayTeam,
        homeTeam: selection.prediction?.homeTeam,
        odds: selection.prediction?.odds || selection.game?.odds
    }))

    const { gameIdsArray, wager, sport, season, year, gameWeek } = teaser
    const wagerObject = {
        gameId: null,
        gameIdsArray,
        year,
        sport,
        gameWeek,
        season,
        predictionsArray,
        wager,
        submitted: Date.now()
    }

    try {
        const currentSession = await Auth.currentSession()
        const IdToken = await currentSession.getIdToken().getJwtToken()
        const response = await apiHost.post('predictions/wager/teaser', {
            headers: {
                'Content-type': 'application/json',
                Authorization: IdToken
            },
            body: JSON.stringify(wagerObject)
        })
        const responseJSON = await response.json()

        if (responseJSON?.errorType) {
            dispatch({
                type: SET_TEASER_ERROR,
                payload: responseJSON.errorType
            })
            return responseJSON
        }

        if (responseJSON?.status === 200) {
            dispatch({
                type: ADD_WAGER,
                payload: wagerObject
            })
            dispatch({ type: SUBMITTED_TEASER, payload: wagerObject })
            dispatch({ type: CLEAR_TEASER_ERROR })
            return responseJSON
        }

        return responseJSON
    } catch (error) {
        dispatch({
            type: SET_TEASER_ERROR,
            payload: { error: `${error}` }
        })
        throw error
    }
}

export const fetchWagers = ({ sport, year, season, week, gameId }) => async (dispatch) => {
    // console.log('fetchWagers', sport, year, season, week, gameId)
    try {
        dispatch({ type: LOADING_WAGERS })
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        
        let fetchWagerResponse = await apiHost.get(`predictions/wager?${sport ? `sport=${sport}` : ''}${year ? `&year=${year}` : ''}${season ? `&season=${season}` : ''}${week ? `&gameWeek=${week}` : ''}${gameId ? `&gameId=${gameId}` : ''}`, {
            headers: {
                Authorization: IdToken
            }
        })
        let fetchWagerResponseJSON = await fetchWagerResponse.json()
        if (fetchWagerResponseJSON.errorType) {
            return fetchWagerResponseJSON
        }
        // console.log('fetchWagerResponseJSON', fetchWagerResponseJSON)
        if (fetchWagerResponseJSON.status === 200) {
            const sortedWagers = fetchWagerResponseJSON.wagers.sort((a,b) => {
                console.log('a.submitted, b.submitted', a.submitted, b.submitted)
                return a.submitted < b.submitted ? 1 : -1
            })
            dispatch({
                type: SET_WAGERS,
                payload: sortedWagers
            })
            return { wagers: sortedWagers, status: 200 }
        }
    } catch (wagerError) {
        console.error(wagerError)
        dispatch({
            type: SET_ERRORS,
            payload: wagerError
        })
    }
}

export const fetchUserWagers = ({ userId, sport, year, season }) => async (dispatch) => {
    console.log('fetchUserWagers', userId, sport, year, season)
    if (!userId) {
        dispatch({
            type: SET_WAGERS,
            payload: []
        })
        return []
    }

    try {
        dispatch({ type: LOADING_WAGERS })
        let currentSession = await Promise.race([
            Auth.currentSession(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Auth session timeout')), AUTH_SESSION_TIMEOUT_MS))
        ])
        let IdToken = await currentSession.getIdToken().getJwtToken()

        const queryParams = new URLSearchParams({ userId })
        if (sport) {
            queryParams.set('sport', sport)
        }
        if (year) {
            queryParams.set('year', year)
        }
        if (season) {
            queryParams.set('season', season)
        }

        let fetchWagerResponse = await apiHost.get(`predictions/wager?${queryParams.toString()}`, {
            headers: {
                Authorization: IdToken
            }
        })
        let fetchWagerResponseJSON = await fetchWagerResponse.json()
        if (fetchWagerResponseJSON.errorType) {
            return fetchWagerResponseJSON
        }
        console.log('fetchUserWagers response', fetchWagerResponseJSON)
        if (fetchWagerResponseJSON.status === 200) {
            const sortedWagers = fetchWagerResponseJSON.wagers.sort((a,b) => {
                console.log('a.submitted, b.submitted', a.submitted, b.submitted)
                return a.submitted < b.submitted ? 1 : -1
            })
            dispatch({
                type: SET_WAGERS,
                payload: sortedWagers
            })
            return { wagers: sortedWagers, status: 200 }
        }
    } catch (wagerError) {
        console.error(wagerError)
        dispatch({
            type: SET_ERRORS,
            payload: wagerError
        })
    }
}
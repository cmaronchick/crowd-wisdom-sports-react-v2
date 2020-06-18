import {
    LOADING_GROUPS,
    SET_GROUPS,
    LOADING_GROUP,
    SET_GROUP,
    SELECT_GROUP_SEASON,
    JOIN_GROUP,
    JOINING_GROUP,
    LEAVE_GROUP,
    CREATE_GROUP,
    DELETE_GROUP,
    SET_ERRORS,
    CLEAR_ERRORS
    } from '../types'
import ky from 'ky/umd'

import { Auth } from '@aws-amplify/auth'

export const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://y5f8dr2inb.execute-api.us-west-2.amazonaws.com/dev/'})
    

export const fetchGroups = (sport, year, season) => async (dispatch) => {
    dispatch({type: LOADING_GROUPS})
    console.log('sport, year, season', sport, year, season)
    let currentSession, IdToken;
    let getOptions = {};
    try {
        currentSession = await Auth.currentSession()
        IdToken = await currentSession.getIdToken().getJwtToken()
        getOptions = {
            headers: {
                Authorization: IdToken
            }
        }
    } catch (getUserError) {
        console.log('getUserError', getUserError)
    }
    try {
        let fetchGroupsResponse = await apiHost.get(`group/${sport}/${year}${season ? `?season=${season}` : ''}`,getOptions).json()
        console.log('fetchGroupsResponse', fetchGroupsResponse)
        dispatch({
            type: SET_GROUPS,
            payload: fetchGroupsResponse
        })
    } catch (fetchGroupsError) {
        dispatch({
            type: SET_ERRORS,
            payload: fetchGroupsError
        })
    }
}

export const fetchGroup = (sport, year, season, groupId) => async (dispatch) => {
    dispatch({type: LOADING_GROUP})
    console.log('sport, year, season, groupId', sport, year, season, groupId)
    let currentSession, IdToken;
    let getOptions = {};
    try {
        currentSession = await Auth.currentSession()
        IdToken = await currentSession.getIdToken().getJwtToken()
        getOptions = {
            headers: {
                Authorization: IdToken
            }
        }
    } catch (getUserError) {
        console.log('getUserError', getUserError)
    }
    try {
        let fetchGroupResponse = await apiHost.get(`group/${sport}/${year}/${groupId}${season ? `?season=${season}` : ''}`,getOptions).json()
        console.log('fetchGroupResponse', fetchGroupResponse)

        // set the group selected season
        // in order to
        // display the user predictions for the proper season
        // --- NOTE ---
        // this may differ from the default season in the redux store
        fetchGroupResponse.group.selectedSeason = season
        dispatch({
            type: SET_GROUP,
            payload: fetchGroupResponse.group
        })
    } catch (fetchGroupError) {
        console.log('fetchGroupError', fetchGroupError);
        dispatch({
            type: SET_ERRORS,
            payload: fetchGroupError
        })
    }
}

export const joinGroup = (sport, year, groupId, password) => async (dispatch) => {
    try {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentSession = await Auth.currentSession()
        const IdToken = await currentSession.getIdToken().getJwtToken()
        const postOptions = {
            headers: {
                Authorization: IdToken
            },
            body: JSON.stringify(password)
        }
        let joinGroupResponse = await apiHost.post(`group/${sport}/${year}/${groupId}/joingroup`, postOptions).json()
        console.log('joinGroupResponse', joinGroupResponse)
        dispatch({
            type: JOIN_GROUP,
            payload: {
                firstName: currentUser.attributes.given_name,
                lastName: currentUser.attributes.family_name,
                preferred_username: currentUser.attributes.preferred_username,
                username: currentUser.username,
                results: {
                    weekly: [{
                        predictionScore: 0
                    }],
                    overall: {
                        predictionScore: 0
                    }
                }
            }
        })
        dispatch({
            type: CLEAR_ERRORS
        })
    } catch (joinGroupError) {
        console.log('joinGroupError', joinGroupError)

        dispatch({
            type: SET_ERRORS,
            payload: joinGroupError
        })
    }
}

export const leaveGroup = (sport, year, groupId) => async (dispatch) => {

    try {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        let leaveGroupResponse = await apiHost.post(
          `group/${sport}/${year}/${groupId}/leavegroup`, {
            headers: {
                'Authorization': IdToken
            }
          }
        ).json();
        dispatch({
            type: LEAVE_GROUP,
            payload: currentUser.username
        })
    } catch (error) {
        console.error(error);
    }
}

export const selectGroupSeason = (sport, year, selectedSeason, groupId) => (dispatch) => {
    dispatch({
        type: SELECT_GROUP_SEASON,
        payload: selectedSeason
    })
    console.log('sport, year, selectedSeason, groupId', sport, year, selectedSeason, groupId)
    dispatch(fetchGroup(sport, year, selectedSeason, groupId))
}
import {
    LOADING_GROUPS,
    SET_GROUPS,
    LOADING_GROUP,
    SET_GROUP,
    UPDATE_GROUP,
    SELECT_GROUP_SEASON,
    JOIN_GROUP,
    JOINING_GROUP,
    LEAVE_GROUP,
    CREATE_GROUP,
    CREATING_GROUP,
    LOADING_GROUP_PREDICTIONS,
    SET_GROUP_PREDICTIONS,
    SET_ERRORS,
    CLEAR_ERRORS,
    TOGGLE_CREATE_GROUP_MODAL
    } from '../types'
import ky from 'ky/umd'

import { Auth } from '@aws-amplify/auth'
import { Storage } from '@aws-amplify/storage'

export const apiHost = ky.create({prefixUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : 'https://app.stakehousesports.com/api/'})
    

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
        let groupPredictions = {}
        if (fetchGroupResponse.group.predictions && fetchGroupResponse.group.predictions.length > 0) {
            fetchGroupResponse.group.predictions.forEach(prediction => {
                groupPredictions[prediction.gameId] = {
                    ...prediction
                }
            })
            dispatch({
                type: SET_GROUP_PREDICTIONS,
                payload: {
                    type: 'group',
                    name: fetchGroupResponse.group.groupName,
                    ...groupPredictions
                }
            })
        }
    } catch (fetchGroupError) {
        console.log('fetchGroupError', fetchGroupError);
        dispatch({
            type: SET_ERRORS,
            payload: fetchGroupError
        })
    }
}

export const joinGroup = (sport, year, groupId, password) => async (dispatch) => {
    dispatch({
        type: JOINING_GROUP
    })
    try {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentSession = await Auth.currentSession()
        const IdToken = await currentSession.getIdToken().getJwtToken()
        const searchParams = new URLSearchParams()
        searchParams.set('groupPassword', password)
        const postOptions = {
            headers: {
                Authorization: IdToken
            },
            body: searchParams
        }
        let joinGroupResponse = await apiHost.post(`group/${sport}/${year}/${groupId}/joingroup`, postOptions).json()
        console.log('joinGroupResponse', joinGroupResponse)
        dispatch(fetchGroup(sport,year, null,groupId))
        dispatch({
            type: JOIN_GROUP,
            payload: currentUser
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

export const createGroup = (groupDetails, picture) => async (dispatch) => {
    dispatch({
        type: CREATING_GROUP
    })
    const { owner, year, sport, season, groupName, password } = groupDetails
    const groupPublic = groupDetails.public

    const filename = picture ? `${groupName}-${picture.name}`: 'icons8-trophy-64.png';
    const searchParams = new URLSearchParams()
    searchParams.set('owner', JSON.stringify({...owner}))
    searchParams.set('year', year)
    searchParams.set('sport', sport)
    searchParams.set('season', season)
    searchParams.set('groupName', groupName)
    searchParams.set('public', groupPublic)
    searchParams.set('password', password)
    searchParams.set('picture', `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`)
    console.log(searchParams)
    try {
        const currentSession = await Auth.currentSession()
        const IdToken = await currentSession.getIdToken().getJwtToken()
        const createGroupResponse = await apiHost.post(`group/create`, {
            headers: {
                Authorization: IdToken,
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: searchParams
        }).json()
        console.log('createGroupResponse', createGroupResponse)
        dispatch({
            type: TOGGLE_CREATE_GROUP_MODAL,
            payload: false
        })
        dispatch({
            type: CREATE_GROUP,
            payload: {...createGroupResponse.group.groupInfo}
        })
        if (picture && (picture.type === 'image\png' || picture.type === 'image\jpeg')) {
            const stored = await Storage.put(filename, picture, {
                contentType: picture.type
            });
            console.log('stored.key', stored)
        }
        dispatch({
            type: CLEAR_ERRORS
        })
    } catch(createGroupError) {
        console.log('createGroupError', createGroupError)
        dispatch({
            type: SET_ERRORS,
            payload: createGroupError
        })
    }
}

export const updateGroupDetails = (groupDetails) => async (dispatch) => {
    const { picture } = groupDetails
    console.log('picture', picture)
    try {
        let currentUser = await Auth.currentAuthenticatedUser()
        let currentSession = await Auth.currentSession()
        let IdToken = await currentSession.getIdToken().getJwtToken()
        if (groupDetails.picture) {
            groupDetails.picture = `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${picture ? `${groupDetails.groupId}-${picture.name}` : `icons8-trophy-64.png`}`
        }
        let updateGroupResponse = await apiHost.post('group/update', {
            headers: {
                Authorization: IdToken,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(groupDetails)
        }).json()
        console.log('updateGroupResponse', updateGroupResponse)

        if (groupDetails.picture) {
            const filename = `${groupDetails.groupId}-${picture.name}`;
            const stored = await Storage.put(filename, picture, {
                contentType: picture.type
            });
            console.log('stored.key', stored)
            // return stored.key;
            // console.log('uploadImageResponse', uploadImageResponse)
            // dispatch(getUserData())
            // updateUserDetails({
            //     picture: `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`
            // })
        }
        dispatch({
            type: UPDATE_GROUP,
            payload: groupDetails
        })
    } catch (updateGroupDetailsError) {
        console.log('updateGroupDetailsError', updateGroupDetailsError)
        dispatch({
            type: SET_ERRORS,
            payload: updateGroupDetailsError
        })
    }
}

export const uploadGroupImage = (group, image) => async (dispatch) => {
    try {
        let currentUser = await Auth.currentAuthenticatedUser();
        let currentSession = await Auth.currentSession()
        const { groupName } = group

        console.log('image.type', image.type)
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            return {
                type: SET_ERRORS,
                errors: 'Please upload either a JPG or PNG.'
            }
        }
        const filename = `${groupName}-${image.name}`;
        console.log('image', image)
        const stored = await Storage.put(filename, image, {
            contentType: image.type
        });
        group.picture = `https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/${filename}`
        dispatch(updateGroupDetails(group))
    } catch (uploadImageError) {
        console.log('uploadImageError', uploadImageError)
        return {
            type: SET_ERRORS,
            errors: uploadImageError
        }
    }

}

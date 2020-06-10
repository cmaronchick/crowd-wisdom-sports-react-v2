import {
    LOADING_GROUPS,
    SET_GROUPS,
    LOADING_GROUP,
    SET_GROUP,
    SELECT_GROUP_SEASON,
    JOIN_GROUP,
    LEAVE_GROUP,
    CREATE_GROUP,
    DELETE_GROUP
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    groups: {},
    loadingGroups: false,
    group: {},
    loadingGroup: false
}


export default function(state = initialState, action) {
    switch(action.type) {
        case LOADING_GROUPS:
            return {
                ...state,
                loadingGroups: true
            }
        case SET_GROUPS:
            return {
                ...state,
                ...action.payload,
                loadingGroups: false
            }
        case LOADING_GROUP:
            return {
                ...state,
                loadingGroup: true
            }
        case SET_GROUP:
            return {
                ...state,
                group: {...action.payload},
                loadingGroup: false
            }
        case SELECT_GROUP_SEASON:
            return {
                ...state,
                group: {
                    ...state.group,
                    selectedSeason: action.payload
                },
                loadingGroup: false
            }
        case JOIN_GROUP:
            let joinGroup = {...state.group}
            console.log('joinGroup', joinGroup)
            joinGroup.memberOf = true;
            joinGroup.users.push({...action.payload})
            return {
                ...state,
                group: {...joinGroup}
            }
        case LEAVE_GROUP:
            let leaveGroup = {...state.group}
            console.log('leaveGroup', leaveGroup)
            leaveGroup.memberOf = false;
            leaveGroup = leaveGroup.users.filter(user => user.username !== action.payload.username)
            return {
                ...state,
                group: {...leaveGroup}
            }
        default:
            return {
                ...state
            }
    }
}
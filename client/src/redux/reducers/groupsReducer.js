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
    CREATING_GROUP
    } from '../types'


// games = the list of the current sport/season/date games
// game results = tells how many games have resulted in the current timeframe

const initialState = {
    groups: {},
    loadingGroups: false,
    group: {},
    loadingGroup: false,
    creatingGroup: false
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
        case JOINING_GROUP:
            return {
                ...state,
                group: {
                    ...state.group,
                    joiningGroup: action.payload
                }
            }
        case SET_GROUP:
        case UPDATE_GROUP:
            return {
                ...state,
                group: {...action.payload,
                    joiningGroup: false},
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
                group: {...joinGroup,
                joiningGroup: false}
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
        case CREATING_GROUP:
            return {
                ...state,
                creatingGroup: true
            }
        case CREATE_GROUP:
            let createGroupGroups = [...state.groups]
            createGroupGroups.push({...action.payload})
            return {
                ...state,
                creatingGroup: false,
                groups: createGroupGroups
            }
        default:
            return {
                ...state
            }
    }
}
import { 
    TOGGLE_LOGIN_MODAL,
    TOGGLE_LEAVE_GROUP_MODAL,
    TOGGLE_CREATE_GROUP_MODAL,
    TOGGLE_ODDS_CHANGE_MODAL,
    TOGGLE_HOW_TO_PLAY_MODAL,
    ON_CHANGE_TEXT,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'


const initialState = {
    loginModalOpen: false,
    leaveGroupModalOpen: false,
    createGroupModalOpen: false,
    oddsChangeModalOpen: false,
    howToPlayModalOpen: false,
    oddsChangeModalDetails: {},
    errors: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case TOGGLE_LOGIN_MODAL:
            return {
                ...state,
                loginModalOpen: action.payload
            }
        case TOGGLE_LEAVE_GROUP_MODAL:
            return {
                ...state,
                leaveGroupModalOpen: action.payload
            }
        case TOGGLE_CREATE_GROUP_MODAL:
            return {
                ...state,
                createGroupModalOpen: action.payload
            }
        case TOGGLE_ODDS_CHANGE_MODAL:
            return {
                ...state,
                oddsChangeModalOpen: !state.oddsChangeModalOpen,
                oddsChangeModalDetails: action.payload.game ? action.payload : {}
            }
        case TOGGLE_HOW_TO_PLAY_MODAL:
            return {
                ...state,
                howToPlayModalOpen: !state.howToPlayModalOpen
            }
        case ON_CHANGE_TEXT:
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case SET_ERRORS: {
            return { 
                ...state,
                errors: action.payload
            }
        }
        case CLEAR_ERRORS:
            return {
                ...state,
                errors: null
            }
        default:
            return {
                ...state
            }
    }
}
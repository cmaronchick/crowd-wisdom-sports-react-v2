import { 
    TOGGLE_LOGIN_MODAL,
    TOGGLE_LEAVE_GROUP_MODAL,
    ON_CHANGE_TEXT,
    SET_ERRORS,
    CLEAR_ERRORS
} from '../types'


const initialState = {
    loginModalOpen: false,
    leaveGroupModalOpen: false,
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
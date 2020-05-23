import { SET_USER, 
    LOADING_USER, 
    SIGN_IN_USER, 
    SIGN_UP_USER,
    UPDATE_TOKENS,
    LOADING_OTHER_USER,
    SET_OTHER_USER,
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    SET_AUTHENTICATED, 
    SET_UNAUTHENTICATED,
    SET_TOUR_COMPLETED,
    MARK_NOTIFICATIONS_READ } from '../types'

const initialState = {
    authenticated: false,
    tourCompleted: false,
    user: {},
    notifications: [],
    signingInUser: false,
    signingUpUser: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                tourCompleted: true,
                loading: true,
                authenticated: true
            }
        case SET_UNAUTHENTICATED:
            return {
                ...initialState,
                loading: false,
            }
        case SET_TOUR_COMPLETED:
            return {
                ...state,
                tourCompleted: true
            }
        case SET_USER:
            return {
                ...state,
                ...action.payload,
                authenticated: true,
                tourCompleted: true,
                loading: false
            }
        case UPDATE_TOKENS:
            return {
                ...state,
                ...action.payload,
                authenticated: true,
                tourCompleted: true,
                loading: false
            }
        case LOADING_USER:
            return {
                ...state,
                loading: true
            }
        case SIGN_IN_USER:
            return {
                ...state,
                signingInUser: true
            }
        case SIGN_UP_USER:
            return {
                ...state,
                signingUpUser: true
            }
        case MARK_NOTIFICATIONS_READ: 
            let FBUser = {...state.FBUser}
            FBUser.notifications.forEach(notification => notification.read = true);
            return {
                ...state,
                FBUser
            }
        case LOADING_OTHER_USER:
            return {
                ...state,
                loadingOtherUser: true
            }
        case SET_OTHER_USER:
            return {
                ...state,
                profile: {
                    ...action.payload
                },
                loading: false
            }

        default: 
            return {
                ...state
            }
    }
}
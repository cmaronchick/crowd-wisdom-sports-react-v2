import { SET_USER, 
    LOADING_USER, 
    SIGN_IN_USER, 
    SIGN_UP_USER,
    SET_USER_UNCONFIRMED,
    SET_FORGOT_PASSWORD,
    SET_RESET_PASSWORD_SENT,
    CHANGE_USER_DETAILS,
    UPDATE_USER,
    UPDATING_USER,
    UPDATE_TOKENS,
    LOADING_OTHER_USER,
    SET_OTHER_USER,
    SET_AUTHENTICATED, 
    SET_UNAUTHENTICATED,
    SET_TOUR_COMPLETED,
    SET_USER_NOTIFICATIONS,
    MARK_NOTIFICATIONS_READ } from '../types'

const initialState = {
    authenticated: false,
    tourCompleted: false,
    attributes: {},
    updatedAttributes: {},
    notifications: [],
    signingIn: false,
    signingUp: false,
    loading: false,
    updating: false,
    confirmUser: false,
    forgotPassword: false,
    resetCodeSent: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_AUTHENTICATED:
            return {
                ...state,
                tourCompleted: true,
                loading: true,
                authenticated: true,
                confirmUser: false,
                forgotPassword: false,
                resetCodeSent: false
            }
        case SET_UNAUTHENTICATED:
            return {
                ...initialState,
                loading: false,
                updating: false,
                confirmUser: false,
                forgotPassword: false,
                resetCodeSent: false,
            }
        case SET_TOUR_COMPLETED:
            return {
                ...state,
                tourCompleted: true
            }
        case SET_USER:
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload,
                authenticated: true,
                tourCompleted: true,
                loading: false,
                updating: false,
                confirmUser: false,
                forgotPassword: false,
                resetCodeSent: false,
                updatedAttributes: {}
            }
        case CHANGE_USER_DETAILS:
            console.log('action.payload', action.payload)
            let updatedAttributes = {...state.updatedAttributes}
            updatedAttributes[action.payload.attributeKey] = action.payload.attributeValue
            return {
                ...state,
                updatedAttributes

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
        case UPDATING_USER:
            return {
                ...state,
                updating: false
            }
        case SIGN_IN_USER:
            return {
                ...state,
                signingIn: true
            }
        case SIGN_UP_USER:
            return {
                ...state,
                signingUp: true
            }
        case SET_USER_UNCONFIRMED:
            return {
                ...state,
                confirmUser: true
            }
        case SET_FORGOT_PASSWORD:
            return {
                ...state,
                forgotPassword: true
            }
        case SET_RESET_PASSWORD_SENT:
            return {
                ...state,
                resetCodeSent: true
            }
        case SET_USER_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload
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
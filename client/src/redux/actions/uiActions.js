import {
    ON_CHANGE_TEXT,
    TOGGLE_LOGIN_MODAL
} from '../types'

export const toggleLoginModal = (modalOpenState) => (dispatch) => {
    dispatch({
        type: TOGGLE_LOGIN_MODAL,
        payload: modalOpenState
    })
}

export const onChangeText = (event) => (dispatch) => {
    dispatch({
        type: ON_CHANGE_TEXT,
        payload: {
            name: event.target.name,
            value: event.target.value
        }
    })
}
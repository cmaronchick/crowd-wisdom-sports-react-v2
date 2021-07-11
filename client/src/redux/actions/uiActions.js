import {
    ON_CHANGE_TEXT,
    TOGGLE_LOGIN_MODAL,
    TOGGLE_CREATE_GROUP_MODAL,
    TOGGLE_LEAVE_GROUP_MODAL,
    TOGGLE_ODDS_CHANGE_MODAL,
    TOGGLE_HOW_TO_PLAY_MODAL
} from '../types'

export const toggleLoginModal = (modalOpenState) => (dispatch) => {
    dispatch({
        type: TOGGLE_LOGIN_MODAL,
        payload: modalOpenState
    })
}
export const toggleCreateGroupModal = (createGroupModalState) => (dispatch) => {
    dispatch({
        type: TOGGLE_CREATE_GROUP_MODAL,
        payload: createGroupModalState
    })
}
export const toggleLeaveGroupModal = (leaveGroupModalState) => (dispatch) => {
    dispatch({
        type: TOGGLE_LEAVE_GROUP_MODAL,
        payload: leaveGroupModalState
    })
}
export const toggleOddsChangeModal = (game, prediction) => (dispatch) => {
    dispatch({
        type: TOGGLE_ODDS_CHANGE_MODAL,
        payload: {
            game,
            prediction
        }
    })
}
export const toggleHowToPlayModal = (game) => (dispatch) => {
    dispatch({
        type: TOGGLE_HOW_TO_PLAY_MODAL
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

export const onChangeCheckbox = (event) => (dispatch) => {
    console.log('event', event.target)
    dispatch({
        type: ON_CHANGE_TEXT,
        payload: {
            name: event.target.name,
            value: event.target.checked
        }
    })

}
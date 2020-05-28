import React from 'react'

import { connect } from 'react-redux'
import { toggleLoginModal } from '../../redux/actions/uiActions'

import { Button } from 'antd'

const LoginButton = (props) => {
    const { UI, buttonClass } = props
    return (
        <Button className={buttonClass ? buttonClass : null} type="primary" size="large" onClick={() => props.toggleLoginModal(!UI.loginModalOpen)}>
            Login/Sign Up
        </Button>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    toggleLoginModal
}

export default connect(mapStateToProps, mapActionsToProps)(LoginButton)
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import './Profile.css'
// redux
import { connect } from 'react-redux'

import { toggleLoginModal } from '../../redux/actions/uiActions'
import { logout } from '../../redux/actions/userActions'

// Ant Design stuff
import { Button, Row, Col, Typography, Popconfirm, message } from 'antd'
import LoginButton from './LoginButton'
import LoginModal from './LoginModal'

const { Text } = Typography

const Authenticate = (props) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)

    const { user, UI } = props
        return (
            <div>
                {props.user.authenticated ? (
                <Fragment>
                    <Row className="profileRow">
                        <Col span={18} justify="start" align="start">
                            <Text className="username">
                                {user.preferred_username}
                            </Text>
                        </Col>
                        <Col span={6}>
                            <Button type="primary" size="large" onClick={() => props.logout()}>
                                Logout
                            </Button>
                        </Col>
                    </Row>
                </Fragment>
                ) : (
                    <LoginButton />
                )}
                <LoginModal />

            </div>
        )
}

Authenticate.propTypes = {
    user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapDispatchToProps = {
    toggleLoginModal,
    logout,
    deleteAccount
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)

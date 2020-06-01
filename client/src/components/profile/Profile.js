import React, {Fragment} from 'react'

import { connect } from 'react-redux'
import { toggleLoginModal, onChangeText } from '../../redux/actions/uiActions'
import { updateUserDetails, changePassword, changeUserDetails } from '../../redux/actions/userActions'

import LoginButton from './LoginButton'

//MUI Stuff
import { Card, Typography, Form, Input, Button } from 'antd'
import './Profile.less'

const { Title, Paragraph, Text } = Typography

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

const Profile = ({ user, loginModalShow, newPassword, confirmPassword, passwordMatch, changePassword, changeUserDetails, updateUserDetails }) => {

    const attributeNames = {
        email: 'E-mail',
        family_name: 'Last Name',
        given_name: 'First Name',
        preferred_username: 'Preferred Username'
    }

    const onChangeText = (event) => {
        changeUserDetails(event.target.name, event.target.value)
    }
    const handleUpdateButtonClick = () => {
        updateUserDetails(user.updatedAttributes)
    }
    console.log('user.authenticated', user.authenticated)
    return (

        <Card className="profile">
            {user.authenticated ? (
            <Fragment>
            <Form {...layout}>
            {Object.keys(user.attributes).map(attributeKey => {
                return attributeNames[attributeKey] ? (
                    <Form.Item key={attributeKey}
                    label={attributeNames[attributeKey]}
                    name={attributeKey}
                    initialValue={user.attributes[attributeKey]}
                    >
                        <Input id={attributeKey} type="text" name={attributeKey} onChange={onChangeText} />
                    </Form.Item>
                ) : null
            })}
            <Button
                type="primary"
                loading={user.updatingUser}
                disabled={Object.keys(user.updatedAttributes).length > 0}
                onClick={() => updateUserDetails()}>
                Update User Profile
            </Button>
            <div className="profileChangePassword">
                
                <Form.Item
                    label="Current Password"
                    name="password">
                    <Input.Password
                        type="password"
                        name="profileCurrentPassword"
                        placeholder="Enter current password"
                        onChange={onChangeText} />
                </Form.Item>
                <Form.Item name="newPassword"
                label="New Password">
                    <Input.Password type="password" name="profileNewPassword" placeholder="Enter new password" onChange={onChangeText} />
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password">
                    <Input.Password type="password" name="profileConfirmPassword" placeholder="Confirm password" onChange={onChangeText} />
                </Form.Item>
                    <Button onClick={changePassword}>
                        Change Password
                    </Button>
            </div>
            </Form>
            </Fragment>
        ) : (
            <div>
                <Text type="secondary">Please log in or sign up.</Text>
                <LoginButton />
            </div>
        )}
    </Card>
    )
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapActionsToProps = {
    toggleLoginModal,
    updateUserDetails,
    changePassword,
    changeUserDetails
}

export default connect(mapStateToProps, mapActionsToProps)(Profile)
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom/Link'
import {Button, Form, Input, Typography } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { isEmail } from '../../../functions/utils'

const { Title, Text} = Typography

const signUp = props => {
    const { UI,
        handleEditPicture,
        handleImageChange,
        handleSignUpClick,
        handleFBClick,
        signingUp,
        onChangeText } = props
    return (
    <Fragment>
        <Typography>
            <Title level={4}>Sign Up</Title>
        </Typography>
        <Form className="loginForm">
            <Form.Item
            label="Avatar">
            <div className='image-wrapper'>
                <img id="avatarImage" style={{height: 30, width: 30}} src={`https://stakehousesports-userfiles.s3-us-west-2.amazonaws.com/public/blank-profile-picture.png`} alt="profile picture" className='profileImage'/>
                <input type='file' hidden='hidden' id='imageInput' onChange={handleImageChange}/>
                    <Button tip="Edit Profile Picture" 
                        placement="top"
                        onClick={handleEditPicture}
                        type="primary">
                            <EditOutlined />
                    </Button>
            </div>
            </Form.Item>
            <Form.Item
                name="given_name"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}>

                <Input type="text" name="signUpGivenName" placeholder="First Name" onChange={onChangeText} />
                
            </Form.Item>
            <Form.Item
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}>
                
                <Input type="text" name="signUpFamilyName" placeholder="Last Name" onChange={props.onChangeText} />
            </Form.Item>
            <Form.Item
                label="Username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input type="text" name="signUpUsername" placeholder="Username" onChange={props.onChangeText} />
            </Form.Item>

            <Form.Item 
                label="Password"
                rules={[{ required: true, message: 'Please input your password' }]}>
                <Input.Password type="password" name="signUpPassword" placeholder="Password" onChange={props.onChangeText} />
            </Form.Item>
            <Form.Item 
                label="Confirm Password"
                style={(UI.signUpConfirmPassword !== UI.signUpPassword) ? { borderWidth: 1, borderColor: 'red', borderStyle: 'solid'} : null}
                rules={[{ required: true, message: 'Please confirm your password' }]}>
                <Input.Password type="password" name="signUpConfirmPassword" placeholder="Password" onChange={props.onChangeText} />
            </Form.Item>
            <Form.Item
                label="E-mail"
                rules={[{ required: true, message: 'Please input your e-mail' }]}>
                <Input type="e-mail" name="signUpEmail" placeholder="Enter email" onChange={props.onChangeText} />
                <div className="emailDisclaimer">We'll never share your email with anyone else.</div>
            </Form.Item>
            <Form.Item>
                <Text style={{marginRight: 10}}>
                Receive weekly predictions reminder e-mails.
                </Text>
                <Input type="checkbox" name="signUpEmailOptIn" onChange={props.onChangeText} label="Receive weekly predictions reminder e-mails." />
            </Form.Item>
            <Form.Item>
                <Text style={{marginRight: 10}}>
                By signing up, I agree to the Terms of Use and Official Rules.
                </Text>
                <Input type="checkbox" name="signUpEmailOptIn" onChange={props.onChangeText} label={() => (
                    <span>Agree to Terms of Use and <Link to="/rules">Official Rules.</Link></span>
                )} />
            </Form.Item>
            <Button type="primary"
                className="loginButton"
                onClick={handleSignUpClick}
                loading={signingUp}
                disabled={!UI.signUpGivenName || 
                !UI.signUpFamilyName || 
                (!UI.signUpUsername || UI.signUpUsername.length < 5) || 
                (!UI.signUpPassword || UI.signUpPassword.length < 8) || 
                (!UI.signUpConfirmPassword || UI.signUpConfirmPassword !== UI.signUpPassword) ||
                (!UI.signUpEmail || !isEmail(UI.signUpEmail))}>
                Sign Up
            </Button>
            <Button variant="contained" name="facebookSignUpButton" onClick={handleFBClick} className="btn facebook-button socialButton-customizable loginButton">
                <span><svg className="social-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" color="#ffffff">
                    <path fill="#ffffff" d="
                        M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
                        11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
                        11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
                        15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
                        11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"></path>
                </svg></span>
                <span>Continue with Facebook</span>
            </Button>
        </Form>
    </Fragment>
    )
}

signUp.propTypes = {

}

export default signUp

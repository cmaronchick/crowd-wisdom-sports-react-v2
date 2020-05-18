import React, { Component } from 'react'
import {Button, Modal, Tabs, Form, Input, Typography } from 'antd'
import { connect } from 'react-redux';

import { generateRandomString } from '../../functions/utils'

import { login } from '../../redux/actions/userActions'
import { toggleLoginModal, onChangeText } from '../../redux/actions/uiActions'
import { isEmail } from '../../functions/utils'

const { Title, Paragraph, Text } = Typography

const {TabPane} = Tabs

const LoginModal = (props) => {
  const { user, UI } = props
  const { confirmUser, forgotPassword, signingInUser, signingUpUser } = user
    const handleFBClick = () => {
      let state = generateRandomString(16)
      localStorage['amplify_auth_state'] = state
      localStorage['facebookLoginFromPage'] = window.location.href
      window.location.href=`https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=${window.origin}/callback&response_type=CODE&client_id=2n15lhk845sucm0k4fejjqcbev&state=${state}&scope=aws.cognito.signin.user.admin email openid phone profile`
    }
    console.log('user.loading', user.loading)

    return (
      <Modal footer={null} visible={UI.loginModalOpen} onCancel={() => props.toggleLoginModal(!UI.loginModalOpen)} confirmLoading={user.loading}>
        {!confirmUser && !forgotPassword ?
        
        <Tabs defaultActiveKey="signIn" id="uncontrolled-tab-example">
          <TabPane tab="Sign In" key="1">
            <Typography>
             <Title level={4}>Sign In</Title>
            </Typography>
            <Form className="loginForm">
                <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username.' }]}
                label="Username">
                <Input type="text" name="loginUsername" placeholder="Enter username" onChange={props.onChangeText} />
              </Form.Item>

              
                <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password.' }]}>
                <Input type="password" name="loginPassword" placeholder="Password" onChange={props.onChangeText} />
                </Form.Item>
              <Button type="primary" size="medium" className="loginButton" type="submit" onClick={() => props.login(UI.loginUsername, UI.loginPassword)}
                loading={signingInUser}
                disabled={!UI.loginUsername || !UI.loginPassword}>
                  Submit
              </Button>
              <Button variant="contained" name="facebookSignInButton" onClick={() => handleFBClick()} className="btn facebook-button socialButton-customizable loginButton">
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
              <Button variant="contained" color="secondary" onClick={() => props.handleForgotPasswordClick()} className="forgotPasswordLink">
                Forgot Password?
              </Button>
              {UI.errors ? (
                <div><Text type="danger">{UI.errors.message}</Text></div>
              ) : null}
            </Form>
          </TabPane>
          <TabPane eventKey="signUp" tab="Sign Up" key="2">

            <Typography>
              <Title level={4}>Sign Up</Title>
            </Typography>
            <Form className="loginForm">
              <Form.Item
                name="given_name"
                label="First Name"
                rules={[{ required: true, message: 'Please input your first name!' }]}>

                <Input type="text" name="signUpGivenName" placeholder="First Name" onChange={props.onChangeText} />
                
              </Form.Item>
              <Form.Item
                name="family_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please input your last name!' }]}>
                
                <Input type="text" name="signUpFamilyName" placeholder="Last Name" onChange={props.onChangeText} />
              </Form.Item>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                  <Input type="text" name="signUpUsername" placeholder="Username" onChange={props.onChangeText} />
              </Form.Item>

              <Form.Item 
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password' }]}>
                  <Input.Password type="password" name="signUpPassword" placeholder="Password" onChange={props.onChangeText} />
              </Form.Item>
              <Form.Item
                label="E-mail"
                name="email"
                rules={[{ required: true, message: 'Please input your e-mail' }]}>
                  <Input type="e-mail" name="signUpEmail" placeholder="Enter email" onChange={props.onChangeText} />
                  <div className="emailDisclaimer">We'll never share your email with anyone else.</div>
              </Form.Item>
              <Form.Item
                name="emailOptIn">
                  <Text style={{marginRight: 10}}>
                  Receive weekly predictions reminder e-mails.
                  </Text>
                <Input type="checkbox" name="signUpEmailOptIn" onChange={props.onChangeText} label="Receive weekly predictions reminder e-mails." />
                </Form.Item>
              <Button type="primary" className="loginButton" type="submit" onClick={() => props.login(UI.loginUsername, UI.loginPassword)}
                loading={signingInUser}
                disabled={!UI.signUpGivenName || 
                !UI.signUpFamilyName || 
                (!UI.signUpUsername || UI.signUpUsername.length < 5) || 
                (!UI.signUpPassword || UI.signUpPassword.length < 8) || 
                (!UI.signUpEmail || !isEmail(UI.signUpEmail))}>
                  Sign Up
              </Button>
              <Button variant="contained" name="facebookSignUpButton" onClick={() => this.handleFBClick()} className="btn facebook-button socialButton-customizable loginButton">
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
          </TabPane>
          </Tabs>
          : confirmUser ? (
            
                <Form>
                  {/* <Form.Group controlId="formConfirmationCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control type="number" name="confirmUserCode" placeholder="####" onChange={props.onChangeText} />
                  </Form.Group>
                  
                  <Button className="loginButton" variant="primary" onClick={props.handleConfirmUserClick}>
                    Confirm
                  </Button>
                  <Button className="loginButton" variant="secondary" onClick={props.handleResendClick}>
                    Resend Code
                  </Button> */}
                </Form>
          ) : forgotPassword ? (
            <Form>
              {/* <Form.Group controlId="formForgotPasswordUsername">
                <Form.Label>Enter Your Username</Form.Label>
                <Form.Control type="text" name="username" placeholder="Enter username" onChange={props.onChangeText} />
              </Form.Group>
              
              <Button className="loginButton" variant="primary" onClick={props.resetPassword}
                loading={props.sendingPasswordReset}>
                  <span>Reset Password</span>
              </Button>
              {props.resetCodeSent ? (
                <div>
                  <Form.Group controlId="formForgotPassword">
                    <Form.Label>Enter Your New Password</Form.Label>
                    <Form.Control type="password" name="newPassword" placeholder="Enter password" onChange={props.onChangeText} />
                  </Form.Group>
                  <Form.Group controlId="formForgotPasswordConfirmCode">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control type="number" name="confirmUserCode" placeholder="######" onChange={props.onChangeText} />
                  </Form.Group>
                  <Button className="loginButton" variant="primary" onClick={props.handleConfirmUserClick}
                    loading={props.sendingNewPassword}
                    >
                      <span>Submit</span>
                  </Button>
                </div>
              ) : null} */}
            </Form>
          ) : null}
      </Modal>
    )
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

const mapActionsToProps = {
  toggleLoginModal,
  onChangeText,
  login
}

export default connect(mapStateToProps, mapActionsToProps)(LoginModal)
import React, { Fragment } from 'react'
import {Button, Modal, Card, Tabs, Form, Input, Typography } from 'antd'
import Icon from '@ant-design/icons'
import { connect } from 'react-redux';

import { generateRandomString } from '../../functions/utils'

import { login, signUp, confirmUser, resendConfirmation, forgotPassword, resetPassword } from '../../redux/actions/userActions'
import { toggleLoginModal, onChangeText, onChangeCheckbox } from '../../redux/actions/uiActions'
import { handleEditPicture, handleImageChange } from '../../functions/utils'
import store from '../../redux/store'
import { SET_FORGOT_PASSWORD, SET_UNAUTHENTICATED } from '../../redux/types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import SignUpForm from './loginForms/SignUpForm'


const { Title, Text } = Typography

const {TabPane} = Tabs

const LoginModal = (props) => {
  const { user, UI } = props
  const { confirmUser, forgotPassword, resetCodeSent, signingIn, signingUp } = user

    const handleFBClick = (identityProvider) => {
      let state = generateRandomString(16)
      localStorage['amplify_auth_state'] = state
      localStorage['facebookLoginFromPage'] = window.location.href
      // console.log(`https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=https://app.stakehousesports.com&response_type=CODE&client_id=2n15lhk845sucm0k4fejjqcbev&state=${state}&scope=aws.cognito.signin.user.admin+email+openid+phone+profile`)
      window.location.href=`https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=${identityProvider}&redirect_uri=${window.location.hostname === 'localhost' ? `http://` : `https://`}${window.location.host}/callback&response_type=CODE&client_id=2n15lhk845sucm0k4fejjqcbev&state=${state}&scope=${encodeURIComponent('aws.cognito.signin.user.admin email phone profile openid')}` //openid &scope=${encodeURIComponent('aws.cognito.signin.user.admin openid email phone profile')}
    }


    const handleSignUpClick = (event) => {
      const { signUpUsername, signUpPassword, signUpEmail,signUpGivenName, signUpFamilyName,signUpPredictionReminder } = UI
      const formData = new FormData()
      const image = document.getElementById('imageInput').files.length > 0 ? document.getElementById('imageInput').files[0] : null
      if (image) {
        formData.append('picture', image, image.name)
        console.log('image.type', image.type)
      }
      props.signUp(signUpUsername, signUpPassword, {
        email: signUpEmail, 
        given_name: signUpGivenName,
        family_name: signUpFamilyName,
        ['custom:notifyPredictRemind']: signUpPredictionReminder
      }, image)

    }

    const handleConfirmUserClick = () => {
      const { signUpUsername, loginUsername, confirmUserCode } = UI
      if (!signUpUsername && !loginUsername) {
        UI.errors.message = 'Something went wrong. Please log in again.'
      } else {
        props.confirmUser(signUpUsername ? signUpUsername : loginUsername, confirmUserCode)
      }
    }

    const handleResendClick = () => {
      const { signUpUsername, loginUsername } = UI
      if (!signUpUsername && !loginUsername) {
        UI.errors.message = 'Something went wrong. Please log in again.'
      } else {
        props.resendConfirmation(signUpUsername ? signUpUsername : loginUsername)
      }
    }

    const handleForgotPasswordClick = () => {
      store.dispatch({
        type: SET_FORGOT_PASSWORD
      })
    }
    const handleForgotPasswordSubmit = () => {
      const { forgotPasswordUsername } = UI
      props.forgotPassword(forgotPasswordUsername)
    }
    const handleResetPassword = () => {
        const { forgotPasswordUsername, newPassword, resetConfirmCode } = UI
        props.resetPassword(forgotPasswordUsername, newPassword, resetConfirmCode)
    }
    const handleCancelForgotPassword = () => {
      store.dispatch({
        type: SET_UNAUTHENTICATED
      })
    }

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
                <Input.Password
                  type="password"
                  name="loginPassword"
                  placeholder="Password"
                  onChange={props.onChangeText}
                  onKeyPress={(e) => {
                    if ((e.which === 13 || e.keyCode === 13) && (UI.loginUsername && UI.loginPassword)) {
                      props.login(UI.loginUsername, UI.loginPassword)
                    }
                  }}
                 />
                </Form.Item>
              <Button type="primary" size="medium" className="loginButton" onClick={() => props.login(UI.loginUsername, UI.loginPassword)}
                loading={signingIn}
                disabled={!UI.loginUsername || !UI.loginPassword}>
                  Submit
              </Button>
              <Button variant="contained" name="facebookSignInButton" onClick={() => handleFBClick('Facebook')} className="btn facebook-button socialButton-customizable loginButton">
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
              <div className="socialMediaButtons">
                <Button value="small" variant="contained" name="appleSignInButton" onClick={() => handleFBClick('SignInWithApple')} className="btn loginButton" style={{ color: "#000", borderColor: '#000', fontFamily: 'SF Pro Display,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif'}}>
                <Icon component={() => <FontAwesomeIcon icon={faApple} />} />
                  <span>Continue with Apple</span>
                </Button>
                <Button value="small" variant="contained" name="googleSignInButton" onClick={() => handleFBClick('Google')} className="btn loginButton" style={{ color: "#000", borderColor: '#000', fontFamily: 'Roboto, sans-serif'}}>
                <img style={{width: 32, height: 32}} src="/images/btn_google_light_normal_ios.svg" alt="Continue with Google" />
                  <span>Continue with Google</span>
                </Button>
              </div>
              <Button type="danger" color="secondary" onClick={handleForgotPasswordClick} className="forgotPasswordLink">
                Forgot Password?
              </Button>
            </Form>
          </TabPane>
          <TabPane eventKey="signUp" tab="Sign Up" key="2">
            <SignUpForm
              handleEditPicture={handleEditPicture}
              handleImageChange={handleImageChange}
              handleFBClick={handleFBClick}
              handleSignUpClick={handleSignUpClick}
              onChangeText={props.onChangeText}
              onChangeCheckbox={props.onChangeCheckbox}
              signingUp={signingUp}
              UI={UI}
              
              />
          </TabPane>
          </Tabs>
          : confirmUser ? (
            
                <Form>
                  <Form.Item
                    label="Confirmation Code">
                    <Input type="number" name="confirmUserCode" placeholder="####" onChange={props.onChangeText} />
                  </Form.Item>
                  
                  <Button className="loginButton" variant="primary" onClick={handleConfirmUserClick}>
                    Confirm
                  </Button>
                  <Button className="loginButton" variant="secondary" onClick={handleResendClick}>
                    Resend Code
                  </Button>
                </Form>
          ) : forgotPassword && (
            <Card title={resetCodeSent ? 'Set Your New Password' : 'Forgot Password'}>
              <Form>
                <Form.Item
                label="Enter Your Username">
                  <Input type="text" name="forgotPasswordUsername" placeholder="Enter username" onChange={props.onChangeText} />
                </Form.Item>
                
                {resetCodeSent ? (
                  <Fragment>
                    <Form.Item
                      label="Enter Your New Password">
                      <Input type="password" name="newPassword" placeholder="Enter password" onChange={props.onChangeText} />
                    </Form.Item>
                    <Form.Item
                      label="Confirmation Code">
                      <Input type="number" name="resetConfirmCode" placeholder="######" onChange={props.onChangeText} />
                    </Form.Item>
                    <Button className="loginButton" variant="primary" onClick={handleResetPassword}
                      loading={props.sendingNewPassword}
                      >
                        <span>Submit</span>
                    </Button>
                  </Fragment>
                ) : (
                  <Button className="loginButton" variant="primary" onClick={handleForgotPasswordSubmit}
                    loading={props.sendingPasswordReset}>
                      <span>Reset Password</span>
                  </Button>
                )}
                <Button className="loginButton" variant="primary" onClick={handleCancelForgotPassword}>
                    <span>Cancel</span>
                </Button>
              </Form>
            </Card>
          )}
          {UI.errors ? (
            <div><Text type="danger">{UI.errors.message}</Text></div>
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
  onChangeCheckbox,
  login,
  signUp,
  confirmUser,
  resendConfirmation,
  forgotPassword,
  resetPassword
}

export default connect(mapStateToProps, mapActionsToProps)(LoginModal)
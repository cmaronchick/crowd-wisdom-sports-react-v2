import React, { Component } from 'react'
import { Auth } from '@aws-amplify/auth';
import {Modal, Tabs, Tab, Form, Spinner } from 'antd'

//MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
//import 'bootstrap/dist/css/bootstrap.min.css'

const styles = (theme) => ({
  ...theme.spreadThis
})

class LoginModal extends Component {
    constructor(props, context) {
        super(props, context)
        this.handleShow = this.handleShow.bind(this);
        this.state = {
            user: null,
            show: false,
            ...this.props
        }
    }
    handleFBClick = () => {
      window.location.href=`https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=${window.origin}&response_type=CODE&client_id=2n15lhk845sucm0k4fejjqcbev&state=cws-react&scope=aws.cognito.signin.user.admin email openid phone profile`
    }
    handleShow() {
      this.setState({ show: true })
    }

    // handleClose() {
    //   this.setState({ show: false });
    // }
    componentDidMount() {
      //console.log('modal mounted', this.props)
    }
    componentDidUpdate() {
      //console.log('modal updated ', this.props)
    }
  
    render() {
        return (
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {!this.props.confirmUser && !this.props.forgotPassword ?
            
            <Tabs defaultActiveKey="signIn" id="uncontrolled-tab-example">
              <Tab eventKey="signIn" title="Sign In">
                <Form>
                  <Form.Group controlId="formSignInEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter username" onChange={this.props.onChangeText} />
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                  </Form.Group>

                  <Form.Group controlId="formSignInPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={this.props.onChangeText} />
                  </Form.Group>
                  {/* <Form.Group controlId="formBasicChecbox">
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group> */}
                  <Button className="loginButton" variant="contained" color="primary" type="submit" onClick={this.props.signInClick}>
                    {this.props.signingInUser ? (
                      <Spinner animation='border' />
                    ) : (
                      <div>Submit</div>
                    )}

                  </Button>
                  <Button variant="contained" name="facebookSignInButton" onClick={() => this.handleFBClick()} className="btn facebook-button socialButton-customizable loginButton">
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
                  <Button variant="contained" color="secondary" onClick={() => this.props.handleForgotPasswordClick()} className="forgotPasswordLink">
                    Forgot Password?
                  </Button>
                  {this.props.signInError ? (
                    <div>{this.props.signInError.message}</div>
                  ) : null}
                </Form>
              </Tab>
              <Tab eventKey="signUp" title="Sign Up">
                <Form>
                  <Form.Group controlId="formSignUpGivenName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="givenName" placeholder="First Name" onChange={this.props.onChangeText} />
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                  </Form.Group>
                  <Form.Group controlId="formSignUpFamilyName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="familyName" placeholder="Last Name" onChange={this.props.onChangeText} />
                  </Form.Group>
                  <Form.Group controlId="formSignUpUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Username" onChange={this.props.onChangeText} />
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                  </Form.Group>

                  <Form.Group controlId="formSignUpPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" onChange={this.props.onChangeText} />
                  </Form.Group>
                  <Form.Group controlId="formSignUpEmail">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="e-mail" name="email" placeholder="Enter email" onChange={this.props.onChangeText} />
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formSignUpOptIn">
                    <Form.Check type="checkbox" name="emailOptIn" onChange={this.props.onChangeText} label="Receive weekly predictions reminder e-mails." />
                  </Form.Group>
                  <Button className="loginButton" variant="contained" color="primary" type="submit" onClick={this.props.signUpClick}>
                    Submit
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
              </Tab>
              </Tabs>
              : this.props.confirmUser ? (
                
                    <Form>
                      <Form.Group controlId="formConfirmationCode">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control type="number" name="confirmUserCode" placeholder="####" onChange={this.props.onChangeText} />
                      </Form.Group>
                      
                      <Button className="loginButton" variant="primary" onClick={this.props.handleConfirmUserClick}>
                        Confirm
                      </Button>
                      <Button className="loginButton" variant="secondary" onClick={this.props.handleResendClick}>
                        Resend Code
                      </Button>
                    </Form>
              ) : this.props.forgotPassword ? (
                <Form>
                  <Form.Group controlId="formForgotPasswordUsername">
                    <Form.Label>Enter Your Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter username" onChange={this.props.onChangeText} />
                  </Form.Group>
                  
                  <Button className="loginButton" variant="primary" onClick={this.props.resetPassword}>
                    {this.props.sendingPasswordReset ? (
                      <Spinner animation='border' />
                    ) : (
                      <span>Reset Password</span>
                    )}                    
                  </Button>
                  {this.props.resetCodeSent ? (
                    <div>
                      <Form.Group controlId="formForgotPassword">
                        <Form.Label>Enter Your New Password</Form.Label>
                        <Form.Control type="password" name="newPassword" placeholder="Enter password" onChange={this.props.onChangeText} />
                      </Form.Group>
                      <Form.Group controlId="formForgotPasswordConfirmCode">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control type="number" name="confirmUserCode" placeholder="######" onChange={this.props.onChangeText} />
                      </Form.Group>
                      <Button className="loginButton" variant="primary" onClick={this.props.handleConfirmUserClick}>
                        {this.props.sendingNewPassword ? (
                          <Spinner animation='border' />
                        ) : (
                          <span>Submit</span>
                        )}                    
                      </Button>
                    </div>
                  ) : null}
                </Form>
              ) : null}
            </Modal.Body>
          </Modal>
        )
    }
}

export default withStyles(styles)(LoginModal)
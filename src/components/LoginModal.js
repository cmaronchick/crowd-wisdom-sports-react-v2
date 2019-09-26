import React, { Component } from 'react'
import { Auth } from '@aws-amplify/auth';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
//import 'bootstrap/dist/css/bootstrap.min.css'



export default class LoginModal extends Component {
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
      console.log('modal mounted', this.props)
    }
    componentDidUpdate() {
      console.log('modal updated ', this.props)
    }
  
    render() {
        return (
          <Modal show={this.props.show} onHide={this.props.onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {!this.props.confirmUser ?
            
            <Tabs defaultActiveKey="signIn" id="uncontrolled-tab-example">
              <Tab eventKey="signIn" title="Sign In">
                <Form>
                  <Form.Group controlId="formSignInEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Enter email" onChange={this.props.onChangeText} />
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
                  <Button variant="primary" type="submit" onClick={this.props.signInClick}>
                    {this.props.signingInUser ? (
                      <Spinner />
                    ) : (
                      <div>Submit</div>
                    )}

                  </Button>
                  <Button name="facebookSignInButton" onClick={() => this.handleFBClick()} className="btn facebook-button socialButton-customizable">
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
                  <Button variant="primary" type="submit" onClick={this.props.signUpClick}>
                    Submit
                  </Button>
                  <Button name="facebookSignUpButton" onClick={() => this.handleFBClick()} className="btn facebook-button socialButton-customizable">
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
              : (
                
                    <Form>
                      <Form.Group controlId="formConfirmationCode">
                        <Form.Label>Confirmation Code</Form.Label>
                        <Form.Control type="number" name="confirmUserCode" placeholder="####" onChange={this.props.onChangeText} />
                      </Form.Group>
                      
                      <Button variant="primary" onClick={this.props.handleConfirmUserClick}>
                        Confirm
                      </Button>
                      <Button variant="secondary" onClick={this.props.handleResendClick}>
                        Resend Code
                      </Button>
                    </Form>
              )}
            </Modal.Body>
          </Modal>
        )
        /*<div id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loginModalLabel">Log in to PCSM</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                            <div className="row">
                              <div className="col-md-4 col-lg-12" style={{borderRight: 1, borderStyle: 'dotted', borderColor: '#C2C2C2', paddingRight: 30}} id="loginRegistrationColumn">
                                <!-- Nav tabs -->
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#Login" data-toggle="tab">Login</a></li>
                                    <li><a href="#Registration" data-toggle="tab">Registration</a></li>
                                </ul>
                                <!-- Tab panes -->
                                <div className="tab-content">
                                    <div className="tab-pane active" id="Login">
                                        <form role="form" className="form-horizontal">
                                            <div className="form-group">
                                                <fieldset>
                                                    E-mail: <input type="text" id="email" placeholder="Enter your e-mail address" />
                                                    <br />
                                                    <br />
                                                    Password: <input type="password" id="password" placeholder="Enter password" />
                                                    <br />
                                                    <a href="https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://crowdsourcedscores.com">Forgot Password?</a>
                                                    <a href="#" onClick="showForgotPasswordUI()">Forgot Password?</a>
                                                    <br />
                                                    <div style={{width: 250}}>
                                                        <button id="loginUser">Log In</button>
                                                    </div>
                                                    <ul id="loginUserResults"></ul>
                                                    <div className="fb-login-button" data-show-faces="false" data-width="200" data-max-rows="1"></div>
                                                </fieldset>
                                            </div>
                                        </form>
        
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" id="loginUser">Login</button><br />
                                        </div>
                                    </div>
                                    <div className="tab-pane" id="Registration">
                                        <form role="form" className="form-horizontal">
                                          <div className="form-group">
                                            <label for="firstName" className="col-sm-2 control-label">
                                                                First</label>
                                            <div className="col-sm-6">
                                              <div className="row">
                                                <div className="col-md-6">
                                                  <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
        
                                          <div className="form-group">
                                                <label for="lastName" className="col-sm-2 control-label">
                                                                    Last</label>
                                                <div className="col-sm-6">
                                                  <div className="row">
                                                    <div className="col-md-6">
                                                      <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                                                    </div>
                                                  </div>
                                                </div>
                                            </div>
        
                                            <div className="form-group">
                                                <label for="newUsername" className="col-sm-2 control-label">
                                                                    Username (max: 25 characters)</label>
                                                <div className="col-sm-10">
                                                  <input type="text" className="form-control" id="newUsername" placeholder="Username" />
                                                </div>
                                            </div>
                                          <div className="form-group">
                                            <label for="email" className="col-sm-2 control-label">
                                                                Email</label>
                                            <div className="col-sm-10">
                                              <input type="email" className="form-control" id="newEmail" placeholder="Email" />
                                            </div>
                                          </div>
                                          <div className="form-group">
                                            <label for="newPassword" className="col-sm-2 control-label">
                                                                Password</label>
                                            <div className="col-sm-10">
                                              <input type="password" className="form-control" id="newPassword" placeholder="Password" />
                                            </div>
                                          </div>
                                          <div className="row">
                                            <div className="col-sm-2">
                                            </div>
                                            <div className="col-sm-10">
                                                <button type="button" className="btn btn-primary btn-sm" id="signUpUser">
                                                    Submit
                                                </button>
                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                                Close
                                            </button>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>*/
    }
}

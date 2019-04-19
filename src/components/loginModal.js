import React, { Component } from 'react'
import { Auth } from '@aws-amplify/auth';



export default class LoginModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
    }
    render() {
        return (
            <div id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
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
                                {/* <!-- Nav tabs --> */}
                                <ul className="nav nav-tabs">
                                    <li className="active"><a href="#Login" data-toggle="tab">Login</a></li>
                                    <li><a href="#Registration" data-toggle="tab">Registration</a></li>
                                </ul>
                                {/* <!-- Tab panes --> */}
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
                                                    {/* <a href="https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://crowdsourcedscores.com">Forgot Password?</a> */}
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
            </div>
        )
    }
}

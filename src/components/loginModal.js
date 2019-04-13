import React, { Component } from 'react'
import { Auth } from '@aws-amplify/auth';



export default class loginModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
    }
    render() {
        return (
            <div id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginModalLabel">Log in to PCSM</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                            <div class="row">
                              <div class="col-md-4 col-lg-12" style="border-right: 1px dotted #C2C2C2;padding-right: 30px;" id="loginRegistrationColumn">
                                {/* <!-- Nav tabs --> */}
                                <ul class="nav nav-tabs">
                                    <li class="active"><a href="#Login" data-toggle="tab">Login</a></li>
                                    <li><a href="#Registration" data-toggle="tab">Registration</a></li>
                                </ul>
                                {/* <!-- Tab panes --> */}
                                <div class="tab-content">
                                    <div class="tab-pane active" id="Login">
                                        <form role="form" class="form-horizontal">
                                            <div class="form-group">
                                                <fieldset>
                                                    E-mail: <input type="text" id="email" placeholder="Enter your e-mail address" />
                                                    <br />
                                                    <br />
                                                    Password: <input type="password" id="password" placeholder="Enter password" />
                                                    <br />
                                                    {/* <a href="https://crowdsourcedscores.auth.us-west-2.amazoncognito.com/forgotPassword?response_type=token&client_id=2n15lhk845sucm0k4fejjqcbev&redirect_uri=https://crowdsourcedscores.com">Forgot Password?</a> */}
                                                    <a href="#" onClick="showForgotPasswordUI()">Forgot Password?</a>
                                                    <br />
                                                    <div style="width: 90%;">
                                                        <button id="loginUser">Log In</button>
                                                    </div>
                                                    <ul id="loginUserResults"></ul>
                                                    <div class="fb-login-button" data-show-faces="false" data-width="200" data-max-rows="1"></div>
                                                </fieldset>
                                            </div>
                                        </form>
        
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" id="loginUser">Login</button><br />
                                        </div>
                                    </div>
                                    <div class="tab-pane" id="Registration">
                                        <form role="form" class="form-horizontal">
                                          <div class="form-group">
                                            <label for="firstName" class="col-sm-2 control-label">
                                                                First</label>
                                            <div class="col-sm-6">
                                              <div class="row">
                                                <div class="col-md-6">
                                                  <input type="text" class="form-control" id="firstName" placeholder="First Name" />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
        
                                          <div class="form-group">
                                                <label for="lastName" class="col-sm-2 control-label">
                                                                    Last</label>
                                                <div class="col-sm-6">
                                                  <div class="row">
                                                    <div class="col-md-6">
                                                      <input type="text" class="form-control" id="lastName" placeholder="Last Name" />
                                                    </div>
                                                  </div>
                                                </div>
                                            </div>
        
                                            <div class="form-group">
                                                <label for="newUsername" class="col-sm-2 control-label">
                                                                    Username (max: 25 characters)</label>
                                                <div class="col-sm-10">
                                                  <input type="text" class="form-control" id="newUsername" placeholder="Username" />
                                                </div>
                                            </div>
                                          <div class="form-group">
                                            <label for="email" class="col-sm-2 control-label">
                                                                Email</label>
                                            <div class="col-sm-10">
                                              <input type="email" class="form-control" id="newEmail" placeholder="Email" />
                                            </div>
                                          </div>
                                          <div class="form-group">
                                            <label for="newPassword" class="col-sm-2 control-label">
                                                                Password</label>
                                            <div class="col-sm-10">
                                              <input type="password" class="form-control" id="newPassword" placeholder="Password" />
                                            </div>
                                          </div>
                                          <div class="row">
                                            <div class="col-sm-2">
                                            </div>
                                            <div class="col-sm-10">
                                                <button type="button" class="btn btn-primary btn-sm" id="signUpUser">
                                                    Submit
                                                </button>
                                            <button type="button" class="btn btn-secondary" data-dismiss="modal">
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

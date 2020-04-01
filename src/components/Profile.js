import React, { Component } from 'react'
import LoginModal from './LoginModal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const Profile = ({ user, loginModalShow, newPassword, confirmPassword, passwordMatch, changePassword, onChangeText }) => {

    const attributeNames = {
        email: 'E-mail',
        family_name: 'Last Name',
        given_name: 'First Name',
        preferred_username: 'Preferred Username'
    }
    //console.log('user.attributes :', user ? Object.keys(user.attributes) : null);
    return user ? (
        <div className="profile">
            <Form>
            {Object.keys(user.attributes).map(attributeKey => {
                //console.log('attributeKey :', attributeKey);
                return attributeNames[attributeKey] ? (
                    <div key={attributeKey} className="profile profileRow">
                        <div className="profile profileCol">
                            {attributeNames[attributeKey]}
                        </div>
                        <div className="profile profileCol">
                            {user.attributes[attributeKey]}
                        </div>
                    </div>
                ) : null
            })}
            <div className="profileChangePassword">
                
                <Form.Group controlId="formCurrentPassword">
                <div className="profileRow">
                    <div className="profileCol">
                        <Form.Label>
                            Current Password
                        </Form.Label>
                    </div>
                    <div className="profileInput">
                        <Form.Control type="password" name="profileCurrentPassword" placeholder="Enter current password" onChange={onChangeText} />
                    </div>
                </div>
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                <div className="profileRow">
                    <div className="profileCol">
                        <Form.Label>
                            New Password
                        </Form.Label>
                    </div>
                    <div className="profileInput">
                        <Form.Control type="password" name="profileNewPassword" placeholder="Enter new password" onChange={onChangeText} />
                    </div>
                </div>
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                <div className="profileRow">
                    <div className="profileCol">
                        <Form.Label>
                            Confirm Password
                        </Form.Label>
                    </div>
                    <div className="profileInput">
                        <Form.Control type="password" name="profileConfirmPassword" placeholder="Confirm password" onChange={onChangeText} />
                    </div>
                </div>
                </Form.Group>
                <div className="profileRow">
                    {passwordMatch === false ? (
                        <div style={{color: 'red', fontWeight: 'bold'}}>Your passwords do not match. Please enter them again and resubmit.</div>
                    ) : null}
                    <Button onClick={changePassword}>
                        Change Password
                    </Button>
                </div>
            </div>
            </Form>
        </div>
    ) : (
        <LoginModal />
    )
}


export default Profile
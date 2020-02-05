import React, { Component } from 'react'
import LoginModal from './LoginModal'

const Profile = ({ user, loginModalShow }) => {

    const attributeNames = {
        email: 'E-mail',
        family_name: 'Last Name',
        given_name: 'First Name',
        preferred_username: 'Preferred Username'
    }
    //console.log('user.attributes :', user ? Object.keys(user.attributes) : null);
    return user ? (
        <div className="profile">
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
        </div>
    ) : (
        <LoginModal />
    )
}


export default Profile
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from '../src/components/App'
import renderer from 'react-test-renderer'
import Auth from '@aws-amplify/auth'

test(" null Auth test", async () => {
    try {
    const user = await Auth.currentAuthenticatedUser()
    
        console.log('userObj: ', user)
        expect(user).toBe('not authenticated')
    } catch(userObjReject) {
        console.log('userObjReject: ', userObjReject)
        
        expect(userObjReject).toBe('not authenticated')
    }
})

test("snapshot test", () => {
    const tree = renderer
        .create(<Router><App /></Router>)
        .toJSON()
    expect(tree).toMatchSnapshot();
})
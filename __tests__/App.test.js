import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from '../src/components/App'
import renderer from 'react-test-renderer'
import Auth from '@aws-amplify/auth'

test(" null Auth test", () => {
    const user = Auth.currentAuthenticatedUser()
    .then(userObj => {
        console.log('userObj: ', userObj)
        expect(userObj).toBe('not authenticated')
    })
    .catch(userObjReject => {
        console.log('userObjReject: ', userObjReject)
        
        expect(userObjReject).toBe('not authenticated')
    })
})

test("snapshot test", () => {
    const tree = renderer
        .create(<App />)
        .toJSON()
    expect(tree).toMatchSnapshot();
})
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from '../src/components/App'
import renderer from 'react-test-renderer'

test(" snapshot test", () => {
    const tree = renderer.create(<App />).toJSON();
    console.log('tree: ', tree)
    expect(tree).toMatchSnapshot();
})
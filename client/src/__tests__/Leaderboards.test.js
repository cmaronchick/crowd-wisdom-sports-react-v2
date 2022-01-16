import React from 'react'
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Leaderboards from '../components/leaderboards/Leaderboards'
import { Provider } from 'react-redux'
import store from '../redux/store'
import {
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId,
    // Tip: all queries are also exposed on an object
    // called "queries" which you could import here as well
    waitFor,
  } from '@testing-library/dom'
  // adds special assertions like toHaveTextContent
  import '@testing-library/jest-dom/extend-expect'
import { SET_USER } from '../redux/types';

import { FBUser, user } from '../__mocks__/UserTestData'

describe('render the leaderboard screen', () => {
    
    test('present a login button when user is not logged in', () => {
        const {getByText} = render(
        <Provider store={store}>
            <Router><Route component={Leaderboards} /></Router>
        </Provider>);
        console.log({getByText});
        const NoLeaderboard = getByText('Login/Sign Up');
        expect(NoLeaderboard).toBeInTheDocument();;
    })
    test('present a loading game message when game is missing', () => {
        store.dispatch({
            type: SET_USER,
            payload: user
        })
        const {getByText} = render(
        <Provider store={store}>
            <Router><Route component={Leaderboards} /></Router>
        </Provider>);
        console.log({getByText});
        const NoLeaderboard = getByText('No Weekly Leaderboard');
        expect(NoLeaderboard).toBeInTheDocument();;
    })

})
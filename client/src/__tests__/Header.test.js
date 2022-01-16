import React from 'react';
import { render } from '@testing-library/react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/layout/header/Header';
import store from '../redux/store'
import { Provider } from 'react-redux'

import {SET_GAMES, SET_SPORT} from '../redux/types'
describe('header tests', () => {
    store.dispatch({
        type: SET_SPORT,
        payload: {
            sport: 'nfl'
        }
    })
    store.dispatch({
        type: SET_GAMES,
        payload: {
            games: {},
            loadingGames: false
        }

    })
    test('renders only the title', () => {
    const { getByText } = render(<Provider store={store}><Router><Header /></Router>w</Provider>);
    const title = getByText(/Stakehouse Sports/i);
    expect(title).toBeInTheDocument();
    });


    test('renders only the message', () => {
        const { getByText } = render(<Provider store={store}>
            <Router>
            <Header message={`Test message`} />
            </Router>
            </Provider>);
        const message = getByText(/Test message/i);
        expect(message).toBeInTheDocument();
    });
})
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Predictions from '../components/profile/Predictions';
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
import {
    screen, render, getByAltText
} from '@testing-library/react'
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'
import { GETTING_COMPARED_USER_PREDICTIONS, SET_COMPARED_USER_PREDICTIONS } from '../redux/types'

describe('render the game screen', () => {
    test('present a loading game message when predictions are loading', async () => {
        render(<Provider store={store}>
            <Predictions match={{ params: { userId: "cmaronchick" } }} />
        </Provider>);
        // console.log({getByLabelText});
        const LoadingPredictions = await screen.getByText(/No Predictions available yet./i);
        expect(LoadingPredictions).toBeInTheDocument();
    })
    test('present a loading game message when predictions are loading', async () => {
        store.dispatch({
            type: GETTING_COMPARED_USER_PREDICTIONS
        })
        render(<Provider store={store}>
            <Predictions match={{ params: { userId: "cmaronchick" } }} />
        </Provider>);
        // console.log({getByLabelText});
        const LoadingPredictions = await screen.getByAltText(/Predictions loading.../i);
        expect(LoadingPredictions).toBeInTheDocument();
    })


})
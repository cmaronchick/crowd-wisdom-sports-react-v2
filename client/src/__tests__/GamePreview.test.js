import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { render, getByText } from '@testing-library/react';
import { Provider } from 'react-redux'
import store from '../redux/store'
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
import GamePreview from '../../src/components/game/GamePreview'
import { SET_GAMEWEEK, SET_GAME, LOADING_GAME } from '../redux/types';

import {game, crowd, results, prediction} from '../__mocks__/GameTestData'

describe('Game Preview UI Presentations', () => {
    test('shows no game preview state when a game is missing', () => {
        const { getByText } = render(<Provider store={store}><Router>
            <GamePreview game={{}} onClick={() => {return;}} />
            </Router>
        </Provider>);
        const noGameFoundElement = getByText(/No game found/i);
        
        expect(noGameFoundElement).toBeInTheDocument();
    })
    test('shows game information when a game is NOT final and prediction is missing', () => {
        const { getByLabelText, getAllByPlaceholderText } = render(
        <Provider store={store}>
            <Router>
                <GamePreview
                    game={game}
                     onClick={() => {return;}} />
            </Router>
        </Provider>);

        const allPredictionInputs = getAllByPlaceholderText(/##/i);
        
        expect(allPredictionInputs.length).toEqual(2);
    })
    test('show prediction value when a prediction is defined and game is not final', () => {
        const { getByLabelText, getAllByPlaceholderText } = render(
        <Provider store={store}>
            <Router>
                <GamePreview game={game} onClick={() => {return;}} />
            </Router>
        </Provider>);
        const allPredictionInputs = getAllByPlaceholderText(/##/i);
        
        expect(allPredictionInputs.length).toEqual(2);
    })
    test('shows game information when a game is final and prediction is missing', () => {
        game.results = results
        const { getByText } = render(
        <Provider store={store}>
            <Router>
                <GamePreview game={game} onClick={() => {return;}} />
            </Router>
        </Provider>);
        const noGamePredictionFoundElement = getByText(/No prediction for this game/i);
    
        expect(noGamePredictionFoundElement).toBeInTheDocument();
    })
    test('shows game information when a game is final and prediction is submitted', () => {
        game.results = results
        game.prediction = prediction
        const { getByText } = render(
        <Provider store={store}><Router>
            <GamePreview game={game}
            predictions={[{ type: 'user', name: 'Me', ...prediction}]}
            onClick={() => {return;}} /></Router>
        </Provider>);
        const noGamePredictionFoundElement = getByText('Prediction score', { exact: false});
        
        expect(noGamePredictionFoundElement).toBeInTheDocument();
    })
    test('show a prediction for each user submitted', () => {
        game.results = results
        const predictions = [{ name: 'Me', type: 'user', ...prediction }, { name: "ATN Heroes", type: 'group', ...prediction}, { name: 'PaulCullin', type: 'user', ...prediction}]
        const { getByText } = render(
        <Provider store={store}><Router>
            <GamePreview game={game}
            predictions={predictions}
            onClick={() => {return;}} /></Router>
        </Provider>);

        let predictionRows = []
        predictions.forEach(prediction => {
            if (getByText(prediction.name)) {
                predictionRows.push(true)
            }
        })
        expect(predictionRows.length).toEqual(predictions.length);
    })

})
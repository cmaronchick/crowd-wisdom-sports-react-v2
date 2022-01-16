import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { render, getByText } from '@testing-library/react';
import { Provider } from 'react-redux'
import store from '../redux/store'

import GamePreview from '../../src/components/game/GamePreview'
import { SET_GAMEWEEK, SET_GAME, LOADING_GAME } from '../redux/types';

import {gameNotFinal, gameFinal, crowd, results, prediction} from '../__mocks__/GameTestData'

describe('Game Preview UI Presentations', () => {
    test('shows no game preview state when a game is missing', () => {
        const { getByText } = render(<Provider store={store}><Router>
            <GamePreview game={{}} onClick={() => {return;}} handleChangeGameScore={() => true} />
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
                    game={gameNotFinal}
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
                <GamePreview game={gameNotFinal} onClick={() => {return;}} />
            </Router>
        </Provider>);
        const allPredictionInputs = getAllByPlaceholderText(/##/i);
        
        expect(allPredictionInputs.length).toEqual(2);
    })
    test('shows game information when a game is final and prediction is missing', () => {
        gameFinal.results = results
        const { getByText } = render(
        <Provider store={store}>
            <Router>
                <GamePreview game={gameFinal} onClick={() => {return;}} />
            </Router>
        </Provider>);
        const noGamePredictionFoundElement = getByText(/No prediction for this game/i);
    
        expect(noGamePredictionFoundElement).toBeInTheDocument();
    })
    test('shows game information when a game is final and prediction is submitted', () => {
        gameFinal.results = results
        gameFinal.prediction = prediction
        const { getByText } = render(
        <Provider store={store}><Router>
            <GamePreview game={gameFinal}
            predictions={[{ type: 'user', name: 'Me', ...prediction}]}
            onClick={() => {return;}} /></Router>
        </Provider>);
        const noGamePredictionFoundElement = getByText('Prediction score', { exact: false});
        
        expect(noGamePredictionFoundElement).toBeInTheDocument();
    })
    test('show a prediction for each user submitted', () => {
        gameFinal.results = results
        const predictions = [{ name: 'Me', type: 'user', ...prediction }, { name: "ATN Heroes", type: 'group', ...prediction}, { name: 'PaulCullin', type: 'user', ...prediction}]
        const { getByText } = render(
        <Provider store={store}><Router>
            <GamePreview game={gameFinal}
            predictions={predictions}
            onClick={() => {return;}} /></Router>
        </Provider>);

        let predictionRows = []
        predictions.forEach(prediction => {
            if (getByText(prediction.name.length <= 5 ? prediction.name : `${prediction.name.substring(0, 4)}...`)) {
                predictionRows.push(true)
            }
        })
        expect(predictionRows.length).toEqual(predictions.length);
    })

})
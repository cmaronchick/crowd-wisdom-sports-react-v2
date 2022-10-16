import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { render } from '@testing-library/react';
import { Provider } from 'react-redux'
import store from '../redux/store'

import Game from '../../src/components/game/Game'
import GameOddsChart from '../components/game/GameOddsChart';
import { SET_GAMEWEEK, SET_GAME, LOADING_GAME } from '../redux/types';

// const game = {
//     "gameId":1233884,
//     "year":2019,
//     "awayTeam":{
//         "fullName":"Minnesota Vikings",
//         "shortName":"Vikings",
//         "city":"Minnesota",
//         "code":"MIN"
//     },
//     "gameWeek":2,
//     "homeTeam":{
//         "fullName":"San Francisco 49ers",
//         "shortName":"49ers",
//         "city":"San Francisco",
//         "code":"SF"
//     },
//     "location":"Levi's Stadium",
//     "odds":{
//         "spread":-7,
//         "total":45,
//         "history":[{"date":"2020-01-06T01:11:40.019Z","spread":-6,"total":45},{"date":"2020-01-06T09:00:05.818Z","total":45,"spread":-6.5},{"date":"2020-01-06T09:01:56.994Z","total":45,"spread":-6.5},{"date":"2020-01-06T09:04:51.255Z","total":45,"spread":-6.5},{"date":"2020-01-06T16:25:31.600Z","total":45.5,"spread":-6.5},{"date":"2020-01-07T09:00:03.901Z","total":45,"spread":-7},{"date":"2020-01-07T09:02:08.999Z","total":45,"spread":-7},{"date":"2020-01-07T09:04:57.421Z","total":45,"spread":-7}]},"season":"post","sport":"nfl","startDateTime":"2020-01-11T21:35:00.000Z","status":"notStarted","weather":{"id":800,"main":"Clear","description":"clear sky","icon":"01d","temp":284.93,"feels_like":280.38,"temp_min":284.93,"temp_max":284.93,"pressure":1024,"sea_level":1024,"grnd_level":1016,"humidity":60,"temp_kf":0},"crowd":{"awayTeam":{"score":""},"homeTeam":{"score":""},"total":"","spread":""},"predictionSubmitted":false,"userAuthenticated":true}

import GameTestData from '../__mocks__/GameTestData'

describe('render the game screen', () => {
    
    test('present a loading game message when game is missing', () => {
        store.dispatch({
            type: LOADING_GAME
        })
        const { getByTitle } = render(<Provider store={store}><Router><Route component={Game} /></Router></Provider>);
        const linkElement = getByTitle(/Loading Game/i);
        
        expect(linkElement).toBeInTheDocument();
    })
    test('present a no game found when no game is returned', () => {
        store.dispatch({
            type: SET_GAME,
            payload: {}
        })

        const { getByText } = render(<Provider store={store}><Router><Route component={Game} /></Router></Provider>);
        const linkElement = getByText(/No game found/i);
        
        expect(linkElement).toBeInTheDocument();
    })


})

describe('render the odds charts', () => {

    test('no game provided', () => {
        const { getByText } = render(<Provider store={store}><Router><Route component={GameOddsChart} /></Router></Provider>);
        const linkElement = getByText(/No game provided/i);
        
        expect(linkElement).toBeInTheDocument();

    })
})
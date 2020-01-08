import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import renderer from 'react-test-renderer'
import Game from '../src/components/Game'

const game = {
    "gameId":1233884,
    "year":2019,
    "awayTeam":{
        "fullName":"Minnesota Vikings",
        "shortName":"Vikings",
        "city":"Minnesota",
        "code":"MIN"
    },
    "gameWeek":2,
    "homeTeam":{
        "fullName":"San Francisco 49ers",
        "shortName":"49ers",
        "city":"San Francisco",
        "code":"SF"
    },
    "location":"Levi's Stadium",
    "odds":{
        "spread":-7,
        "total":45,
        "history":[{"date":"2020-01-06T01:11:40.019Z","spread":-6,"total":45},{"date":"2020-01-06T09:00:05.818Z","total":45,"spread":-6.5},{"date":"2020-01-06T09:01:56.994Z","total":45,"spread":-6.5},{"date":"2020-01-06T09:04:51.255Z","total":45,"spread":-6.5},{"date":"2020-01-06T16:25:31.600Z","total":45.5,"spread":-6.5},{"date":"2020-01-07T09:00:03.901Z","total":45,"spread":-7},{"date":"2020-01-07T09:02:08.999Z","total":45,"spread":-7},{"date":"2020-01-07T09:04:57.421Z","total":45,"spread":-7}]},"season":"post","sport":"nfl","startDateTime":"2020-01-11T21:35:00.000Z","status":"notStarted","weather":{"id":800,"main":"Clear","description":"clear sky","icon":"01d","temp":284.93,"feels_like":280.38,"temp_min":284.93,"temp_max":284.93,"pressure":1024,"sea_level":1024,"grnd_level":1016,"humidity":60,"temp_kf":0},"crowd":{"awayTeam":{"score":""},"homeTeam":{"score":""},"total":"","spread":""},"predictionSubmitted":false,"userAuthenticated":true}

describe('render the game screen', () => {
    
    test('present a loading game message when game is missing', () => {
        const gamerender = renderer.create(<Router><Game /></Router>).toJSON();
        console.log({gamerender});
        expect(gamerender).toMatchSnapshot();
    })
    // test('present a game when there is data', () => {
    //     const gamerender = renderer.create(<Router><Game initialData={{game}} /></Router>).toJSON();
    //     console.log({gamerender});
    //     expect(gamerender).toMatchSnapshot();
    // })

})
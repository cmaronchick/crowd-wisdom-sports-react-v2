import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import renderer from 'react-test-renderer'
import Game from '../src/components/Game'

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

const game = {
    "gameId":1235067,
    "year":2019,
    "awayTeam":{
        "fullName":"San Francisco 49ers",
        "shortName":"49ers",
        "city":"San Francisco",
        "code":"SF"
    },
    "gameWeek":4,
    "homeTeam":{
        "fullName":"Kansas City Chiefs",
        "shortName":"Chiefs",
        "city":"Kansas City",
        "code":"KC"
    },
    "location":"Hard Rock Stadium",
    "odds":{
        "spread":-1.5,
        "total":54,
        "history":[
            {"date":"2020-01-27T05:49:21.823Z","spread":-1,"total":54},
            {"date":"2020-01-27T09:00:04.206Z","total":54,"spread":-1},
            {"date":"2020-01-28T09:00:04.206Z","total":54,"spread":-1},
            {"date":"2020-01-29T09:00:04.266Z","total":54,"spread":-1},
            {"date":"2020-01-24T09:00:04.117Z","total":54,"spread":-1},
            {"date":"2020-01-25T09:00:04.474Z","total":54.5,"spread":-1},{"date":"2020-01-26T09:00:04.152Z","total":54.5,"spread":-1},{"date":"2020-01-26T09:02:09.271Z","total":54.5,"spread":-1},{"date":"2020-01-26T09:05:13.552Z","total":54.5,"spread":-1},{"date":"2020-01-27T09:00:03.698Z","total":54.5,"spread":-1},{"date":"2020-01-27T09:00:04.326Z","total":54.5,"spread":-1},{"date":"2020-01-28T09:00:04.426Z","total":54.5,"spread":-1},{"date":"2020-01-28T09:01:58.267Z","total":54.5,"spread":-1},{"date":"2020-01-28T09:05:11.625Z","total":54.5,"spread":-1},{"date":"2020-01-29T09:00:04.055Z","total":54.5,"spread":-1},{"date":"2020-01-29T09:00:04.797Z","total":54.5,"spread":-1},{"date":"2020-01-29T09:02:03.696Z","total":54.5,"spread":-1},{"date":"2020-01-29T09:05:15.820Z","total":54.5,"spread":-1},{"date":"2020-01-30T09:00:04.050Z","total":54.5,"spread":-1.5},{"date":"2020-01-31T09:00:03.907Z","total":54.5,"spread":-1.5},{"date":"2020-01-31T09:01:59.585Z","total":54.5,"spread":-1.5},{"date":"2020-01-31T09:05:11.202Z","total":54.5,"spread":-1.5},{"date":"2020-02-01T09:00:03.536Z","total":54,"spread":-1.5},{"date":"2020-02-01T09:00:04.219Z","total":54,"spread":-1.5}
        ]},
        "season":"post",
        "sport":"nfl",
        "startDateTime":"2020-02-02T23:30:00.000Z",
        "status":"final","weather":{"id":800,"main":"Clear","description":"clear sky","icon":"01d","temp":67,"feels_like":287.18,"temp_min":292.51,"temp_max":292.51,"pressure":1019,"sea_level":1019,"grnd_level":1019,"humidity":44,"temp_kf":0},"crowd":{"awayTeam":{"score":28.7},"homeTeam":{"score":29.4},"total":58.1,"spread":-0.7,"results":{"predictionScore":2,"winner":{"correct":1,"push":0},"spread":{"correct":0,"push":0},"total":{"correct":0,"push":0}}},"results":{"awayTeam":{"score":20,"periods":{"q1":3,"q2":7,"q3":10,"q4":0}},"homeTeam":{"score":31,"periods":{"q1":7,"q2":3,"q3":0,"q4":21}},"total":51,"spread":-11},"predictionSubmitted":false}
describe('render the game screen', () => {
    
    test('present a loading game message when game is missing', () => {
        const gamerender = renderer.create(<Router><Game /></Router>).toJSON();
        console.log({gamerender});
        expect(gamerender).toMatchSnapshot();
    })
    test('present a game when there is data', () => {
        const gamerender = renderer.create(<Router><Game initialData={{game}} game={game} /></Router>).toJSON();
        console.log({gamerender});
        expect(gamerender).toMatchSnapshot();
    })

})
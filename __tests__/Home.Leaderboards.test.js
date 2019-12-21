import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import HomeLeaderboards from '../src/components/Home.Leaderboards'
import renderer from 'react-test-renderer'

const testLeaderboardData = {
    _id: "5df31318b814f591b891cf67",
    gameWeek:15,
    season:"reg",
    sport:"nfl",
    year:2019,
    weekly:{
        crowd:{
            winner:{
                correct:11,
                push:0,
                percentage:0.6875
            },
            spread:{
                correct:6,
                push:1,
                percentage:0.4
            },
            total:{
                correct:9,
                push:0,
                percentage:0.5625
            },
            predictionScore:52,
            totalGames:16
        },users:[
            {
                username:"cmaronchick",
                winner:{correct:13,push:0,bullseyes:1},
                spread:{correct:11,push:1,bullseyes:3},
                total:{correct:6,push:0,bullseyes:0},
                stars:{wagered:30,net:9,roi:0.3},
                predictionScore:64,totalPredictions:16,
                preferred_username:"cmaronchick"
            },
            {
                username:"cmaronchick-hotmail",winner:{correct:10,push:0,bullseyes:1},spread:{correct:9,push:1,bullseyes:2},total:{correct:9,push:0,bullseyes:0},stars:{wagered:0,net:0,roi:null},predictionScore:59,totalPredictions:16,preferred_username:"CBSPetePrisco"
            },
            {
                username:"Facebook_10205896813734452",winner:{correct:53,push:0,bullseyes:8},spread:{correct:35,push:1,bullseyes:2},total:{correct:37,push:1,bullseyes:2},stars:{wagered:0,net:0,roi:null},predictionScore:262,totalPredictions:78,preferred_username:"ElliePeterson"
            }
        ]
    }
}

let fetchingLeaderboards = false,
    selectedLeaderboard = "overall",
    sport = "nfl",
    year = 2019,
    week = 15,
    season = "reg",
    handleSwitchLeaderboard = () => {},
    handleOnUserClick = () => {}

describe('it should present the Home Leaderboards', () => {
    
    test('present a blank leaderboard when there is no data', () => {
        const homeleaderboardsrender = renderer.create(<HomeLeaderboards />).toJSON();
        console.log({homeleaderboardsrender});
        expect(homeleaderboardsrender).toMatchSnapshot();
    })
    test('when sport and data are missing', () => {
        const homeleaderboardsrender = renderer.create(<Router><HomeLeaderboards year={year} week={week} season={season} /></Router>).toJSON();
        console.log({homeleaderboardsrender});
        expect(homeleaderboardsrender).toMatchSnapshot();
    })
    test('when everything but data is provided', () => {
        const homeleaderboardsrender = renderer.create(<Router><HomeLeaderboards sport={sport} year={year} week={week} season={season} /></Router>).toJSON();
        console.log({homeleaderboardsrender});
        expect(homeleaderboardsrender).toMatchSnapshot();
    })
    test('present a leaderboard when there is valid data', () => {
        const homeleaderboardsrender = renderer.create(<Router><HomeLeaderboards sport={sport} year={year} week={week} season={season} overallLeaderboardData={testLeaderboardData} /></Router>).toJSON();
        console.log({homeleaderboardsrender});
        expect(homeleaderboardsrender).toMatchSnapshot();
    })

})

import React from 'react';
import HomeLeaderboards from '../src/components/Home.Leaderboards'
import renderer from 'react-test-renderer'

describe('it should present the Home Leaderboards', () => {
    
    test('present a blank leaderboard when there is no data', () => {
        const homeleaderboardsrender = renderer.create(<HomeLeaderboards />).toJSON();
        console.log({homeleaderboardsrender});
        expect(homeleaderboardsrender).toMatchSnapshot();
    })

})

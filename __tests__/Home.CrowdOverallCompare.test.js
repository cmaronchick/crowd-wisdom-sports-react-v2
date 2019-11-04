import React from 'react';
import CrowdOverallCompare from '../src/components/Home.CrowdOverallCompare'
import renderer from 'react-test-renderer'


describe('it should have a sport, year, season, and week', () => {
    
});

test('should receive the leaderboard in proper format', async () => {
        
    const crowdCompare = renderer.create(<CrowdOverallCompare />).toJSON()
    expect(crowdCompare).toMatchSnapshot()
})


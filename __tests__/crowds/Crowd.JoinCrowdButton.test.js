import React from 'react';
import JoinCrowdButton from '../../src/components/Crowd.JoinCrowdButton'
import renderer from 'react-test-renderer'

describe('it should create a button', () => {

})

test('present a button', () => {
    const button = renderer.create(<JoinCrowdButton />).toJSON()
    expect(button).toMatchSnapshot();
})
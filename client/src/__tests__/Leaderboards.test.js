import React from 'react'
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'
import Leaderboards from '../components/leaderboards/Leaderboards'
import {
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId,
    // Tip: all queries are also exposed on an object
    // called "queries" which you could import here as well
    waitFor,
  } from '@testing-library/dom'
  // adds special assertions like toHaveTextContent
  import '@testing-library/jest-dom/extend-expect'

describe('render the game screen', () => {
    
    test('present a loading game message when game is missing', () => {
        const {getByText} = render(<Router><Leaderboards /></Router>);
        console.log({getByText});
        const NoLeaderboard = getByText('No leaderboard found');
        expect(NoLeaderboard).toBeInTheDocument();;
    })

})
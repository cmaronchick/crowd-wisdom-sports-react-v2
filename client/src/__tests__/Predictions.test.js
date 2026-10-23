import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Predictions } from '../components/profile/Predictions';
import { Provider } from 'react-redux'
import store from '../redux/store'
import {
    getByLabelText,
    getByText,
    getByTestId,
    queryByTestId,
    // Tip: all queries are also exposed on an object
    // called "queries" which you could import here as well
    waitFor,
} from '@testing-library/dom'
import {
    screen, render, getByAltText
} from '@testing-library/react'
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'
import { GETTING_COMPARED_USER_PREDICTIONS, SET_COMPARED_USER_PREDICTIONS } from '../redux/types'
import { getTeaserOptions } from '../functions/utils'

describe('render the game screen', () => {
    test('does not redirect when a userId is present and no user is logged in', async () => {
        const sport = { gameWeekData: { week: 1, year: 2024, season: 'reg' } }
        const predictions = { user: {}, comparedUser: { gettingPredictions: false, predictions: [] } }

        render(
            <Router>
                <Provider store={store}>
                    <Predictions
                        user={{}}
                        predictions={predictions}
                        games={{ games: {} }}
                        sport={sport}
                        match={{ params: { userId: 'other-user' } }}
                        setGameWeek={jest.fn()}
                        getUserPredictions={jest.fn()}
                        submitTeaser={jest.fn()}
                    />
                </Provider>
            </Router>
        )

        expect(await screen.findByText(/other-user Week 1 Predictions/i)).toBeInTheDocument()
    })

    test('presents an empty-state when no predictions are available for the user', async () => {
        const sport = { gameWeekData: { week: 1, year: 2024, season: 'reg' } }
        const predictions = { user: {}, comparedUser: { gettingPredictions: false, predictions: [] } }

        render(
            <Router>
                <Provider store={store}>
                    <Predictions
                        user={{ username: 'cmaronchick' }}
                        predictions={predictions}
                        games={{ games: {} }}
                        sport={sport}
                        match={{ params: { userId: 'cmaronchick' } }}
                        setGameWeek={jest.fn()}
                        getUserPredictions={jest.fn()}
                        submitTeaser={jest.fn()}
                    />
                </Provider>
            </Router>
        );

        expect(await screen.findByText(/No Predictions available yet\./i)).toBeInTheDocument();
    })

    test('shows a loading spinner while the selected user predictions are fetching', async () => {
        const sport = { gameWeekData: { week: 1, year: 2024, season: 'reg' } }
        const predictions = { user: {}, comparedUser: { gettingPredictions: true, predictions: [] } }

        render(
            <Router>
                <Provider store={store}>
                    <Predictions
                        user={{ username: 'cmaronchick' }}
                        predictions={predictions}
                        games={{ games: {} }}
                        sport={sport}
                        match={{ params: { userId: 'cmaronchick' } }}
                        setGameWeek={jest.fn()}
                        getUserPredictions={jest.fn()}
                        submitTeaser={jest.fn()}
                    />
                </Provider>
            </Router>
        );

        expect(await screen.findByAltText(/Predictions loading.../i)).toBeInTheDocument();
    })

    test('builds both teaser options from the current spread', () => {
        const game = {
            gameId: 998,
            awayTeam: { code: 'WAS', participantId: 'was' },
            homeTeam: { code: 'SEA', participantId: 'sea' },
            odds: { spread: -8 },
        }
        const prediction = {
            awayTeam: { score: 20 },
            homeTeam: { score: 24 },
            odds: { spread: -8 },
        }

        const options = getTeaserOptions(game, prediction)

        expect(options).toEqual(expect.arrayContaining([
            expect.objectContaining({ teamCode: 'SEA', label: 'SEA -2', teasedLine: -2, originalLine: -8 }),
            expect.objectContaining({ teamCode: 'WAS', label: 'WAS +14', teasedLine: 14, originalLine: 8 }),
        ]))
    })
})
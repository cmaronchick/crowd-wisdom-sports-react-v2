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

    test('hides tabs and renders only final predictions for another user', async () => {
        const sport = { gameWeekData: { week: 1, year: 2024, season: 'reg' } }
        const predictions = {
            user: {},
            comparedUser: {
                gettingPredictions: false,
                predictions: [{
                    gameId: 'game-1',
                    awayTeam: { code: 'SEA', score: 24 },
                    homeTeam: { code: 'WAS', score: 17 },
                    odds: { spread: -3, total: 42 },
                    predictionScore: 2,
                    results: { awayTeam: { score: 24 }, homeTeam: { score: 17 } }
                }],
            }
        }

        render(
            <Router>
                <Provider store={store}>
                    <Predictions
                        user={{ username: 'current-user' }}
                        predictions={predictions}
                        games={{ games: { 'game-1': { gameId: 'game-1', status: 'final', awayTeam: { code: 'SEA' }, homeTeam: { code: 'WAS' }, results: { awayTeam: { score: 24 }, homeTeam: { score: 17 } }, odds: { spread: -3, total: 42 } } } }}
                        sport={sport}
                        match={{ params: { userId: 'other-user' } }}
                        setGameWeek={jest.fn()}
                        getUserPredictions={jest.fn()}
                        submitTeaser={jest.fn()}
                    />
                </Provider>
            </Router>
        )

        expect(screen.queryByText(/Pending/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/Final/i)).not.toBeInTheDocument()
        expect(await screen.findByText(/SEA/i)).toBeInTheDocument()
    })

    test('displays a score of zero for final results', async () => {
        const sport = { gameWeekData: { week: 1, year: 2024, season: 'reg' } }
        const predictions = {
            user: {
                'game-2': {
                    gameId: 'game-2',
                    awayTeam: { code: 'NYG', score: 0 },
                    homeTeam: { code: 'PHI', score: 7 },
                    odds: { spread: 3, total: 44 },
                    predictionScore: 0,
                    results: { awayTeam: { score: 0 }, homeTeam: { score: 7 } }
                }
            },
            comparedUser: { gettingPredictions: false, predictions: [] }
        }

        render(
            <Router>
                <Provider store={store}>
                    <Predictions
                        user={{ username: 'current-user' }}
                        predictions={predictions}
                        games={{ games: { 'game-2': { gameId: 'game-2', status: 'final', awayTeam: { code: 'NYG' }, homeTeam: { code: 'PHI' }, results: { awayTeam: { score: 0 }, homeTeam: { score: 7 } }, odds: { spread: 3, total: 44 } } } }}
                        sport={sport}
                        match={{ params: { userId: 'current-user' } }}
                        setGameWeek={jest.fn()}
                        getUserPredictions={jest.fn()}
                        submitTeaser={jest.fn()}
                    />
                </Provider>
            </Router>
        )

        expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    })
})
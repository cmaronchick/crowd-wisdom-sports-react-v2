import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GamesList from '../components/gamesList/GamesList';
import { Provider } from 'react-redux'
import store from '../redux/store'
import { SET_GAMES } from '../redux/types';

describe('testing the games list', () => {
  test('renders No games', () => {
    store.dispatch({
      type: SET_GAMES,
      payload: {}
    })
    const { getByText } = render(<Provider store={store}><Router><Route component={GamesList} /></Router></Provider>);
    const linkElement = getByText(/No games/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders the games list', () => {
    store.dispatch({
      type: SET_GAMES,
      payload: {
        games: {
          4638149:{
            awayTeam: {
              participantId: 1536, code: 'PHI', shortName: 'Eagles', fullName: 'Philadelphia Eagles'
            },
            crowd: {
              awayTeam: {score: 13},
              homeTeam: {score: 31},
              total: 44, spread: -18
            },
            gameId: 4638149,
            gameWeek: 1,
            homeTeam: {
              participantId: 1544, code: 'TB', shortName: 'Buccaneers', fullName: 'Tampa Bay Buccaneers'
            },
            location: "Tampa, USA",
            matchup: "PHI-TB",
            odds: {
              spread: -9.5, spreadOdds: 106, total: 45.5, totalOdds: -100
            },
            season: "post",
            sport: "nfl",
            startDateTime: "2022-01-16T18:00:00.000Z",
            status: "scheduled",
            weather: {
              id: 500, main: 'Rain', description: 'light rain', icon: '10d', temp: 61
            },
            weekName: "Wild Card",
            year: 2021,
            _id: "61ddda92958657f5d346a815"
          },
          loadingGames: false,
        }
      }
    })
    const { getByText } = render(<Provider store={store}>
      <Router>
        <Route component={GamesList} />
      </Router>
    </Provider>);
    const linkElement = getByText(/vs/i);
    expect(linkElement).toBeInTheDocument();

  })
})

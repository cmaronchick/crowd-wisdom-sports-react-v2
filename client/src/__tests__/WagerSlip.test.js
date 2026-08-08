import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { WagerSlipContent } from '../components/game/WagerSlip';

jest.mock('../redux/actions/predictionsActions', () => ({
  fetchUserWagers: jest.fn(),
}));

const sport = {
  sport: 'nfl',
};

const wagers = [
  {
    _id: 'wager-1',
    gameId: 'game-1',
    sport: 'nfl',
    year: 2024,
    season: 'post',
    gameWeek: 1,
    submitted: '2024-01-10T12:00:00.000Z',
    awayTeam: { code: 'BUF' },
    homeTeam: { code: 'KC' },
    prediction: {
      awayTeam: { code: 'BUF', score: 24 },
      homeTeam: { code: 'KC', score: 21 },
    },
    wager: {
      wagerType: 'moneyline',
      currency: 50,
      odds: -110,
    },
    result: 1,
    net: 95.45,
  },
  {
    _id: 'wager-2',
    gameId: 'game-2',
    sport: 'nfl',
    year: 2024,
    season: 'reg',
    gameWeek: 2,
    submitted: '2024-09-10T12:00:00.000Z',
    awayTeam: { code: 'DAL' },
    homeTeam: { code: 'PHI' },
    prediction: {
      awayTeam: { code: 'DAL', score: 27 },
      homeTeam: { code: 'PHI', score: 24 },
    },
    wager: {
      wagerType: 'total',
      currency: 25,
      odds: -105,
    },
    result: null,
    net: null,
  },
  {
    _id: 'wager-3',
    gameId: 'game-3',
    sport: 'nfl',
    year: 2023,
    season: 'post',
    gameWeek: 1,
    submitted: '2023-01-11T12:00:00.000Z',
    awayTeam: { code: 'MIA' },
    homeTeam: { code: 'BAL' },
    prediction: {
      awayTeam: { code: 'MIA', score: 17 },
      homeTeam: { code: 'BAL', score: 23 },
    },
    wager: {
      wagerType: 'spread',
      currency: 40,
      odds: -110,
    },
    result: -1,
    net: 0,
  },
  {
    _id: 'wager-4',
    gameId: 'game-4',
    sport: 'nfl',
    year: 2023,
    season: 'reg',
    gameWeek: 3,
    submitted: '2023-09-15T12:00:00.000Z',
    awayTeam: { code: 'NYJ' },
    homeTeam: { code: 'NE' },
    prediction: {
      awayTeam: { code: 'NYJ', score: 20 },
      homeTeam: { code: 'NE', score: 20 },
    },
    wager: {
      wagerType: 'moneyline',
      currency: 30,
      odds: 120,
    },
    result: 0,
    net: 30,
  },
];

const renderWagerSlip = () => {
  return render(
    <WagerSlipContent
      sport={sport}
      gamesData={{}}
      wagers={wagers}
      showFilters={true}
      title="Wager History"
    />
  );
};

describe('WagerSlipContent filters', () => {
  test('filters wagers by year and season', () => {
    renderWagerSlip();

    expect(screen.getByText('BUF at KC')).toBeInTheDocument();
    expect(screen.getByText('DAL at PHI')).toBeInTheDocument();
    expect(screen.getByText('MIA at BAL')).toBeInTheDocument();
    expect(screen.getByText('NYJ at NE')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2024' }));

    expect(screen.getByText('BUF at KC')).toBeInTheDocument();
    expect(screen.getByText('DAL at PHI')).toBeInTheDocument();
    expect(screen.queryByText('MIA at BAL')).not.toBeInTheDocument();
    expect(screen.queryByText('NYJ at NE')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Post' }));

    expect(screen.getByText('BUF at KC')).toBeInTheDocument();
    expect(screen.queryByText('DAL at PHI')).not.toBeInTheDocument();
  });

  test('composes year and season filters with type and status filters', () => {
    renderWagerSlip();

    fireEvent.click(screen.getByRole('button', { name: '2024' }));
    fireEvent.click(screen.getByRole('button', { name: 'Regular' }));
    fireEvent.click(screen.getByRole('button', { name: 'TOTAL' }));
    fireEvent.click(screen.getByRole('button', { name: 'OPEN' }));

    expect(screen.getByText('DAL at PHI')).toBeInTheDocument();
    expect(screen.queryByText('BUF at KC')).not.toBeInTheDocument();
    expect(screen.queryByText('MIA at BAL')).not.toBeInTheDocument();
    expect(screen.queryByText('NYJ at NE')).not.toBeInTheDocument();
  });
});
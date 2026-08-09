import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BaseWagerSlip, WagerSlipContent } from '../components/game/WagerSlip';

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
  {
    _id: 'wager-5',
    gameId: 'game-5',
    sport: 'ncaaf',
    year: 2022,
    season: 'reg',
    gameWeek: 5,
    submitted: '2022-10-01T12:00:00.000Z',
    awayTeam: { code: 'ALA' },
    homeTeam: { code: 'UGA' },
    prediction: {
      awayTeam: { code: 'ALA', score: 31 },
      homeTeam: { code: 'UGA', score: 34 },
    },
    wager: {
      wagerType: 'spread',
      currency: 20,
      odds: -108,
    },
    result: 1,
    net: 38.52,
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

const renderBaseWagerSlip = (fetchUserWagers = jest.fn().mockResolvedValue({ wagers, status: 200 })) => {
  return render(
    <BaseWagerSlip
      sport={sport}
      user={{ username: 'tester' }}
      games={{ games: {} }}
      wagers={wagers}
      fetchUserWagers={fetchUserWagers}
      showFilters={true}
      title="Wager History"
    />
  );
};

describe('WagerSlipContent filters', () => {
  test('toggles between current sport history and all user history', () => {
    renderWagerSlip();

    expect(screen.queryByText('ALA at UGA')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '2022' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All Sports' }));

    expect(screen.getByText('ALA at UGA')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2022' })).toBeInTheDocument();
  });

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

  test('shows years, seasons, and weeks based on the selected user history scope', () => {
    renderWagerSlip();

    fireEvent.click(screen.getByRole('button', { name: 'All Sports' }));

    expect(screen.getByRole('button', { name: '2022' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2022' }));

    expect(screen.getByRole('button', { name: 'Regular' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Regular' }));

    expect(screen.getByRole('button', { name: 'WK 5' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'WK 5' }));

    expect(screen.getByText('ALA at UGA')).toBeInTheDocument();
    expect(screen.queryByText('BUF at KC')).not.toBeInTheDocument();
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

  test('fetches current sport by default and full history on All Sports', async () => {
    const fetchUserWagers = jest.fn().mockResolvedValue({ wagers, status: 200 });

    renderBaseWagerSlip(fetchUserWagers);

    await waitFor(() => {
      expect(fetchUserWagers).toHaveBeenCalledWith({ userId: 'tester', sport: 'nfl' });
    });

    fireEvent.click(await screen.findByRole('button', { name: 'All Sports' }));

    await waitFor(() => {
      expect(fetchUserWagers).toHaveBeenCalledWith({ userId: 'tester' });
    });
  });
});
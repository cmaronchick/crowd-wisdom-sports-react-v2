import React from 'react';
import { render } from '@testing-library/react';
import FeaturedGame from '../components/gamesList/FeaturedGame';

const mockGame = {
    gameId: '123',
    awayTeam: { code: 'KC', fullName: 'Kansas City Chiefs' },
    homeTeam: { code: 'SF', fullName: 'San Francisco 49ers' },
    startDateTime: '2025-02-09T18:30:00.000Z',
    status: 'scheduled'
};

test('renders FeaturedGame component', () => {
    const { getByText } = render(<FeaturedGame game={mockGame} onGameClick={() => { }} />);
    expect(getByText(/TRENDING MATCHUP/i)).toBeInTheDocument();
    expect(getByText(/Kansas City Chiefs/i)).toBeInTheDocument();
    expect(getByText(/San Francisco 49ers/i)).toBeInTheDocument();
});

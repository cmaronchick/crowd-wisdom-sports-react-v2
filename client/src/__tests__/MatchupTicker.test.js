import React from 'react';
import { render } from '@testing-library/react';
import MatchupTicker from '../components/gamesList/MatchupTicker';

const mockGames = [
    {
        gameId: '123',
        awayTeam: { code: 'KC' },
        homeTeam: { code: 'SF' }
    },
    {
        gameId: '456',
        awayTeam: { code: 'PHI' },
        homeTeam: { code: 'DAL' }
    }
];

// Mock scrollTo since it's not implemented in JSDOM
Element.prototype.scrollTo = jest.fn();

test('renders MatchupTicker and highlights active game', () => {
    const { getByText, container } = render(
        <MatchupTicker games={mockGames} activeGameId="456" onMatchupClick={() => { }} />
    );
    expect(getByText(/KC/i)).toBeInTheDocument();
    expect(getByText(/SF/i)).toBeInTheDocument();
    expect(getByText(/PHI/i)).toBeInTheDocument();
    expect(getByText(/DAL/i)).toBeInTheDocument();

    // Check if active class is applied to the second item (game 456)
    const activeItem = container.querySelector('.active');
    expect(activeItem).toBeInTheDocument();
    expect(activeItem.textContent).toContain('PHI');
});

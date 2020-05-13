import React from 'react';
import { render } from '@testing-library/react';
import GamesList from './GamesList';

test('renders learn react link', () => {
  const { getByText } = render(<GamesList />);
  const linkElement = getByText(/No games/i);
  expect(linkElement).toBeInTheDocument();
});

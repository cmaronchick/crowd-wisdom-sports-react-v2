import React from 'react';
import { render } from '@testing-library/react';
import GamesList from '../components/gamesList/GamesList';
import { Provider } from 'react-redux'
import store from '../redux/store'

test('renders No games', () => {
  const { getByText } = render(<Provider store={store}><GamesList /></Provider>);
  const linkElement = getByText(/No games/i);
  expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import GamesList from '../components/gamesList/GamesList';
import { Provider } from 'react-redux'
import store from '../redux/store'

test('renders No games', () => {
  const { getByText } = render(<Provider store={store}><Router><Route component={GamesList} /></Router></Provider>);
  const linkElement = getByText(/No games/i);
  expect(linkElement).toBeInTheDocument();
});

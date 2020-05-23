import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux'
import store from './redux/store'
// Amplify Stuff
import Amplify from 'aws-amplify'
import awsmobile from './awsmobile'
Amplify.configure(awsmobile)

test('renders learn react link', () => {
  const { getByText } = render(<Provider store={store}><App /></Provider>);
  const linkElement = getByText(/Stakehouse Sports/i);
  expect(linkElement).toBeInTheDocument();
});

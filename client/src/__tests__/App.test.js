import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from '../App';
import { Provider } from 'react-redux'
import store from '../redux/store'
// Amplify Stuff
import Amplify from 'aws-amplify'
import awsmobile from '../awsmobile'
Amplify.configure(awsmobile)

test('renders learn react link', () => {
  const { getByText, getByRole } = render(<Provider store={store}><Router><Route component={App} /></Router></Provider>);
  const linkElement = getByRole('application');
  expect(linkElement).toBeInTheDocument();
});

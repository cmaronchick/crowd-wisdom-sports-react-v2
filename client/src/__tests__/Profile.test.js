import React from 'react';
import { render } from '@testing-library/react';
import Profile from '../components/profile/Profile';
import { changeUserDetails, updateUserDetails } from '../redux/actions/userActions'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { SET_AUTHENTICATED, SET_USER, CHANGE_USER_DETAILS, UPDATE_USER } from '../redux/types';
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
describe('profile tests', () => {
    test('renders login message', () => {
    const { getByText } = render(
        <Provider store={store}>
        <Router><Profile /></Router>
        </Provider>);
    const title = getByText(/Please log in or sign up./i);
    expect(title).toBeInTheDocument();
    });


    test('renders an update Profile button', () => {
        store.dispatch({
            type: SET_USER,
            payload: {
                authenticated: true,
                tourCompleted: true,
                attributes: {
                    sub: '0d40bad7-7738-41ae-aceb-4fdf5cecd6e2',
                    zoneinfo: '-8',
                    email_verified: false,
                    'custom:completedTour': '1',
                    preferred_username: 'ChrisAronchick',
                    locale: 'en_US',
                    given_name: 'Chris',
                    identities: '[{"userId":"10155298489409129","providerName":"Facebook","providerType":"Facebook","issuer":null,"primary":true,"dateCreated":1534786670246}]',
                    'custom:reminderMailOptIn': '0',
                    name: 'Chris Aronchick',
                    family_name: 'Aronchick',
                    email: 'cmaronchick@yahoo.com'
                }
            }
        })
        const { getByText } = render(<Provider store={store} user={{authenticated: true}}><Router><Profile /></Router></Provider>);
        const message = getByText(/Update User Profile/i);
        expect(message).toBeInTheDocument();
    });
    test('change user details function', () => {
        console.log('testing change user details')
        const attribute = {
            name: 'given_name',
            value: 'Chris'
        }
        const expectedAction = {
            type: CHANGE_USER_DETAILS,
            payload: {
                attributeKey: attribute.name,
                attributeValue: attribute.value
            }
        }
        expect(changeUserDetails(attribute.name, attribute.value)).toEqual(expectedAction)
    });
})
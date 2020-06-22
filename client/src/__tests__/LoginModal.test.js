import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { render } from '@testing-library/react';
import { Provider } from 'react-redux'
import store from '../redux/store'
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
import LoginModal from '../../src/components/profile/LoginModal'
import { SET_UNAUTHENTICATED,
    SET_USER,
    SET_USER_UNCONFIRMED,
    SET_FORGOT_PASSWORD,
    SET_RESET_PASSWORD_SENT,
    TOGGLE_LOGIN_MODAL } from '../redux/types';
import { toggleLoginModal } from '../redux/actions/uiActions';

describe('login modal tests', () => {
    test('renders login modal with sign in and sign up tabs', () => {
        store.dispatch({
            type: TOGGLE_LOGIN_MODAL,
            payload: true
        })
        const { getAllByText } = render(
            <Provider store={store}>
            <LoginModal />
            </Provider>);
        const SignIn = getAllByText(/Sign In/i);
        const SignUp = getAllByText(/Sign Up/i);
        expect(SignIn.length).toEqual(2);
        expect(SignUp.length).toEqual(1);
    });
    test('renders forgot password UI', () => {
        store.dispatch({
            type: SET_FORGOT_PASSWORD
        })
        const { getAllByText } = render(
            <Provider store={store}>
            <LoginModal />
            </Provider>);
        const ForgotPassword = getAllByText(/Forgot Password/i);
        expect(ForgotPassword.length).toEqual(1);
    });

    test('renders reset password UI', () => {
        store.dispatch({
            type: SET_RESET_PASSWORD_SENT
        })
        const { getAllByText } = render(
            <Provider store={store}>
            <LoginModal />
            </Provider>);
        const SubmitNewPassword = getAllByText(/Set Your New Password/i);
        expect(SubmitNewPassword.length).toEqual(1);
    });
})


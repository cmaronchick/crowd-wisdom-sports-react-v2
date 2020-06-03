import React from 'react';
import { render } from '@testing-library/react';
import SideMenu from '../components/layout/sidemenu/SideMenu';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { SET_AUTHENTICATED } from '../redux/types';
describe('side menu tests', () => {
    test('renders only the nac', () => {
    const { getByText } = render(<Provider store={store}><Router><SideMenu /></Router></Provider>);
    const title = getByText(/NFL/i);
    expect(title).toBeInTheDocument();
    });


    test('renders a link to the profile', () => {
        store.dispatch({
            type: SET_AUTHENTICATED
        })
        const { getByText } = render(<Provider store={store} user={{authenticated: true}}><Router><SideMenu /></Router></Provider>);
        const message = getByText(/Profile/i);
        expect(message).toBeInTheDocument();
    });
})
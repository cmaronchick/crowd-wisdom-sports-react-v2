import React from 'react';
import { render } from '@testing-library/react';
import SideMenu from '../components/layout/sidemenu/SideMenu';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../redux/store'
describe('header tests', () => {
    test('renders only the title', () => {
    const { getByText } = render(<Provider store={store}><Router><SideMenu /></Router></Provider>);
    const title = getByText(/NFL/i);
    expect(title).toBeInTheDocument();
    });


    test('renders only the message', () => {
        const { getByText } = render(<Provider store={store}><Router><SideMenu /></Router></Provider>);
        const message = getByText(/Profile/i);
        expect(message).toBeInTheDocument();
    });
})
import React from 'react';
import { render } from '@testing-library/react';
import Header from '../components/layout/header/Header';
import store from '../redux/store'
import { Provider } from 'react-redux'
describe('header tests', () => {
    test('renders only the title', () => {
    const { getByText } = render(<Provider store={store}><Header /></Provider>);
    const title = getByText(/Stakehouse Sports/i);
    expect(title).toBeInTheDocument();
    });


    test('renders only the message', () => {
        const { getByText } = render(<Provider store={store}>
            <Header message={`Test message`} />
            </Provider>);
        const message = getByText(/Test message/i);
        expect(message).toBeInTheDocument();
    });
})
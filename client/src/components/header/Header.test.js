import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
describe('header tests', () => {
    test('renders only the title', () => {
    const { getByText } = render(<Header />);
    const title = getByText(/Stakehouse Sports/i);
    expect(title).toBeInTheDocument();
    });


    test('renders only the message', () => {
        const { getByText } = render(<Header message={`Test message`} />);
        const message = getByText(/Test message/i);
        expect(message).toBeInTheDocument();
    });
})
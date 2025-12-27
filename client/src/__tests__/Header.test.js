import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../components/layout/header/Header';
import store from '../redux/store';

// Mock matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

test('renders Header with logo', () => {
    const { getByAltText } = render(
        <Provider store={store}>
            <Router>
                <Header />
            </Router>
        </Provider>
    );
    const logo = getByAltText(/Stakehouse Sports/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'stake-image.png');
});
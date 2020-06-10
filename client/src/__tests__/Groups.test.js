import React from 'react';
import { render } from '@testing-library/react';
import Group from '../components/groups/Group';
import { fetchGroup } from '../redux/actions/groupActions'
import { LOADING_GROUP, SET_GROUP } from '../redux/types'
import { BrowserRouter as Router, Route } from 'react-router-dom'
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

describe('render the group screen', () => {
    
    test('present a loading game message when game is missing', () => {
        store.dispatch({
            type: LOADING_GROUP
        })
        const { getByTitle } = render(<Provider store={store}><Router><Route component={Group} /></Router></Provider>);
        const linkElement = getByTitle(/Loading Group/i);
        
        expect(linkElement).toBeInTheDocument();
    })
    test('present a no group found when no group is returned', () => {
        store.dispatch({
            type: SET_GROUP,
            payload: {}
        })

        const { getByText } = render(<Provider store={store}><Router><Route component={Group} /></Router></Provider>);
        const linkElement = getByText(/No group found/i);
        
        expect(linkElement).toBeInTheDocument();
    })


})
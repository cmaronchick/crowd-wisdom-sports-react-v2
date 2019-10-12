import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import App from './components/App';
import Navigation from './components/Navigation'


ReactDOM.hydrate(
  <BrowserRouter>
    <App initialData={window.initialData} />
    <Navigation />
  </BrowserRouter>,
  document.getElementById('app')
);

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import App from './components/App';
import Navigation from './components/Navigation'


ReactDOM.hydrate(
  <App initialData={window.initialData} />,
  document.getElementById('app')
);

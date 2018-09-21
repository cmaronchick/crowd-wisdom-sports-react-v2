import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';


ReactDOM.render(
  <App initialGames={window.initialData.games} />,
  document.getElementById('root')
);
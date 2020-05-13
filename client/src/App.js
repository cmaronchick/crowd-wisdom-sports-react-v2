import React from 'react';
import logo from './images/stake-image.svg';
import './App.css';
import Header from './components/header/Header'
import GamePreview from './components/game/GamePreview'
import GamesList from './components/gamesList/GamesList'

function App() {
  return (
    <div className="App">
      <Header />
      <GamesList />
    </div>
  );
}

export default App;

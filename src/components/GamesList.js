import React from 'react';
import GamePreview from './GamePreview';

const GamesList = ({ games, onGameClick }) => {
  return (
    <div>
      {Object.keys(games).map(gameId => 
        <GamePreview
        key={gameId}
        onClick={onGameClick}
        {...games[gameId]} />
      )}
    </div>
  );
};

GamesList.propTypes = {
  games: React.PropTypes.object,
  onGameClick: React.PropTypes.func.isRequired,
};

export default GamesList;
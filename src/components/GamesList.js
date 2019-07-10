import React from 'react';
import GamePreview from './GamePreview';

const GamesList = ({ games, onGameClick, onChangeGameScore, onSubmitPrediction }) => {
  console.log('games: ', games);
  return (
    <div className="gamesList">
      {Object.keys(games).map(gameId => 
        <GamePreview
        key={gameId}
        onClick={onGameClick}
        onChangeGameScore={onChangeGameScore}
        onSubmitPrediction={onSubmitPrediction}
        {...games[gameId]} />
      )}
    </div>
  );
};

// GamesList.propTypes = {
//   games: React.PropTypes.object,
//   onGameClick: React.PropTypes.func.isRequired
// };

export default GamesList;
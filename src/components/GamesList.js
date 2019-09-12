import React from 'react';
import GamePreview from './GamePreview';

const GamesList = ({ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }) => {
  //console.log({ games, gamePredictions });
  return (
    <div className="gamesList">
      {Object.keys(games).map(gameId => {
        if (gamePredictions[gameId]) {
          console.log(`gamePredictions[gameId]: ${JSON.stringify(gamePredictions[gameId])}`)
        }

        //console.log({ gameId, game: games[gameId], gamePrediction: gamePredictions[gameId]})
        return <GamePreview
        key={gameId}
        onClick={onGameClick}
        onChangeGameScore={onChangeGameScore}
        onChangeStarSpread={onChangeStarSpread}
        onChangeStarTotal={onChangeStarTotal}
        onSubmitPrediction={onSubmitPrediction}
        game={games[gameId]} gamePrediction={gamePredictions[gameId]} />
      }
      )}
    </div>
  );
};

// GamesList.propTypes = {
//   games: React.PropTypes.object,
//   onGameClick: React.PropTypes.func.isRequired
// };

export default GamesList;
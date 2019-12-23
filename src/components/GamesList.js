import React from 'react';
import GamePreview from './GamePreview';

const GamesList = ({ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }) => {
  //console.log({ games, gamePredictions });
  let orderedGames = {}
  Object.keys(games).sort((a,b) => {
    return (games[a].results === games[b].results) ? 0 : games[a].results ? -1 : 1
  }).forEach((key) => {
    orderedGames[key] = games[key]
  })

  return (
    <div className="gamesList">
      {Object.keys(games).sort((a,b) => {
        return (games[b].status === games[a].status) ? new Date(games[a].startDateTime) - new Date(games[b].startDateTime) : new Date(games[b].startDateTime) - new Date(games[a].startDateTime)
      }).map(gameId => {
        //console.log({gameId});
        // if (gamePredictions[gameId]) {
        //   console.log(`gamePredictions[gameId]: ${JSON.stringify(gamePredictions[gameId])}`)
        // }

        //console.log({ gameId, game: games[gameId], gamePrediction: gamePredictions[gameId]})
        return <GamePreview
        key={gameId}
        onClick={onGameClick}
        onChangeGameScore={onChangeGameScore}
        onChangeStarSpread={onChangeStarSpread}
        onChangeStarTotal={onChangeStarTotal}
        onSubmitPrediction={onSubmitPrediction}
        game={games[gameId]}
        gamePrediction={gamePredictions[gameId]} />
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
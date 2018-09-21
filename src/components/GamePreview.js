import React from 'react';

const GamePreview = (game) => {
  return (
  <div className="GamePreview">
    <div className="game-header">
      {game.awayTeam.code} vs. {game.homeTeam.code}
    </div>
    <div className="game-details">
      {/* {game.startDateTime} */}
    </div>
  </div>
  );
};

export default GamePreview;
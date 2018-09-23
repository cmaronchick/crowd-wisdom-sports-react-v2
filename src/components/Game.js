import React, { Component, PropTypes } from 'react';
class Game extends Component {
  render() {
    return (
          <div className="Game">
            {this.props.gameId}
            <div className="game-header">
                {this.props.awayTeam.shortName} vs. {this.props.homeTeam.shortName}
            </div>
            <div className="home-link link" onClick={this.props.gamesListClick}>
                Games List
            </div>

          </div>
    );
  }
}

Game.propTypes = {
  gameId: PropTypes.number.isRequired,
  awayTeam: PropTypes.shape({
    code: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired
  }),
  homeTeam: PropTypes.shape({
    code: PropTypes.string.isRequired,
    shortName: PropTypes.string.isRequired
  }),
  gamesListClick: PropTypes.func.isRequired
};

export default Game;
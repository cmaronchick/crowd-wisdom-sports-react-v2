import React, { Component, PropTypes } from 'react';
class Game extends Component {
  render() {
    return (
          <div className="Game">
            {this.props.gameId}
          </div>
    );
  }
}

Game.propTypes = {
  gameId: PropTypes.number.isRequired
};

export default Game;
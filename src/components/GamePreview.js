import React, { Component } from 'react';

class GamePreview extends Component {
  handleClick = () => {
    this.props.onClick(this.props.gameId);
  }
  render() {
    return (
    <div className="link GamePreview" onClick={this.handleClick}>
      <div className="game-header">
        {this.props.awayTeam.code} vs. {this.props.homeTeam.code}
      </div>
      <div className="game-details">
        {/* {game.crowd.awayTeam.score}<br/>
        {game.crowd.homeTeam.score} */}
      </div>
    </div>
    );
  }
}

GamePreview.propTypes = {
  gameId: React.PropTypes.number.isRequired,
  awayTeam: React.PropTypes.shape({
    code: React.PropTypes.string.isRequired
  }),
  homeTeam: React.PropTypes.shape({
    code: React.PropTypes.string.isRequired
  }),
  onClick: React.PropTypes.func.isRequired
};

export default GamePreview;
import React, { Component } from 'react';

class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props
    }
  }
  
  componentDidUpdate() {
    console.log('gamePreview updated')
  }
  handleClick = () => {
    this.props.onClick(this.props.gameId);
  }
  render() {
    const game = this.state;
    console.log('gamepreview 15 game: ', game)
    return (
    <div className="link GamePreview" onClick={this.handleClick}>
      <div className="game-header">
        {this.props.awayTeam.fullName} vs. {this.props.homeTeam.fullName}
      </div>
      <div className="game-details">
        <div className="headerRow">
          <div className="teamName"></div>
          <div>{game.prediction ? (
              'Me'
            ) : ''}</div>
          <div>Crowd</div>
          <div>Results</div>
        </div>
        <div className="team">
          <div className="teamName">{game.awayTeam.shortName}</div>
          <div>{game.prediction ? (
              game.prediction.awayTeam.score
            ) : ''}
          </div>
          <div>{game.crowd.awayTeam.score}</div>
          <div>{game.results.awayTeam.score}</div>
        </div>
        <div className="team">
          <div className="teamName">{game.homeTeam.shortName}</div>
          <div>{game.prediction ? (
              game.prediction.homeTeam.score
            ) : ''}
          </div>
          <div>{game.crowd.homeTeam.score}</div>
          <div>{game.results.homeTeam.score}</div>
        </div>
        {/* {game.crowd.awayTeam.score}<br/>
        {game.crowd.homeTeam.score} */}
      </div>
    </div>
    );
  }
}

// GamePreview.propTypes = {
//   gameId: React.PropTypes.number.isRequired,
//   awayTeam: React.PropTypes.shape({
//     code: React.PropTypes.string.isRequired
//   }),
//   homeTeam: React.PropTypes.shape({
//     code: React.PropTypes.string.isRequired
//   }),
//   onClick: React.PropTypes.func.isRequired
// };

export default GamePreview;
import React, { Component, PropTypes } from 'react';
import * as api from '../api'
class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props
    }
  }

  getGame = () => {
    api.getUserSession(userSession => {
      api.fetchGame(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.gameId, userSession)
    })
  }

  componentDidMount() {
    this.getGame()
  }
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

// Game.propTypes = {
//   gameId: PropTypes.number.isRequired,
//   awayTeam: PropTypes.shape({
//     code: PropTypes.string.isRequired,
//     shortName: PropTypes.string.isRequired
//   }),
//   homeTeam: PropTypes.shape({
//     code: PropTypes.string.isRequired,
//     shortName: PropTypes.string.isRequired
//   }),
//   gamesListClick: PropTypes.func.isRequired
// };

export default Game;
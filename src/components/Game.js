import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom'
import * as api from '../api'
import Auth from '@aws-amplify/auth'
import GamePreview from './GamePreview'
import GameOddsChart from '../components/GameOddsChart'
class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props.initialData

    }
  }

  getGame = async () => {
    let user = await Auth.currentAuthenticatedUser()
    let userSession = await Auth.currentSession()
    try {
      
      if (this._isMounted) {
      let gameObj = await api.fetchGame(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.gameId, userSession)
      console.log({game: gameObj.game});
      let gamePrediction = gameObj.game ? gameObj.game.prediction : null;
      this.setState({game: gameObj.game, gamePrediction, user})
      }
    } catch(getGameError) {
      console.log({getGameError});
    }
  }

  componentDidUpdate() {

  }

  _isMounted = true;

  componentDidMount() {
    console.log({GameStateOnMount: this.state})
    this.getGame()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { game } = this.state;
    if (!game) {
      return (
        <div>Loading game ...</div> 
      )
    }
    return (
          <div className="Game">
            {this.props.gameId}
            <div className="game-header">
                {this.props.awayTeam.shortName} vs. {this.props.homeTeam.shortName}
            </div>
            <GamePreview
              onChangeGameScore={this.props.onChangeGameScore}
              onChangeStarSpread={this.props.onChangeStarSpread}
              onChangeStarTotal={this.props.onChangeStarTotal}
              onSubmitPrediction={this.props.onSubmitPrediction}
              game={game} gamePrediction={this.props.gamePrediction} />
            <GameOddsChart game={game} />

            <Link className="home-link link" to={`/${this.props.sport}/${this.props.year}/${this.props.season}/${this.props.gameWeek}`}>
                Games List
            </Link>

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
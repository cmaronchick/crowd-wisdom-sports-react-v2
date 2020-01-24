import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom'
import * as api from '../apis'
import Auth from '@aws-amplify/auth'
import awsconfig from '../awsexports'
// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
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
    try {
      let user = await Auth.currentAuthenticatedUser()
      let userSession = await Auth.currentSession()
      
      if (this._isMounted) {
      let gameObj = await api.fetchGame(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.gameId, userSession)
      console.log({game: gameObj.game});
      let gamePrediction = gameObj.game ? gameObj.game.prediction : null;
      this.setState({game: gameObj.game, gamePrediction, user})
      }
    } catch(getGameError) {
      console.log({getGameError});
      if (this._isMounted) {
        try {
          let gameObj = await api.fetchGame(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.gameId, null)
          console.log({game: gameObj.game});
          let gamePrediction = gameObj.game ? gameObj.game.prediction : null;
          this.setState({game: gameObj.game, gamePrediction, user})
        }catch(getGameErrorUnauth) {
          console.log({getGameErrorUnauth});
        }
      }
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

  handleGamesListClick = () => {
    this.props.gamesListClick(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.ref);
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
            <Link onClick={this.handleGamesListClick} className="home-link link" to={`/${this.props.sport}/games/${this.props.year}/${this.props.season}/${this.props.gameWeek}`}>
              <i className="fas fa-arrow-left" style={{fontSize: '1.2em', fontWeight: 'bold' }}></i>
            </Link>
            <GamePreview
              onChangeGameScore={this.props.onChangeGameScore}
              onChangeStarSpread={this.props.onChangeStarSpread}
              onChangeStarTotal={this.props.onChangeStarTotal}
              onSubmitPrediction={this.props.onSubmitPrediction}
              onClick={this.props.onGameClick}
              game={game} gamePrediction={this.props.gamePrediction} />
            <GameOddsChart game={game} />

            <Link onClick={this.handleGamesListClick} className="home-link link" to={`/${this.props.sport}/games/${this.props.year}/${this.props.season}/${this.props.gameWeek}`}>
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
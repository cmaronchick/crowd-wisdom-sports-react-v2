import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import * as apis from '../apis'
import * as utils from '../utils'
import StarRatingComponent from 'react-star-rating-component'
import GamePreviewCrowd from './GamePreview.Crowd'
import GamePreviewResults from './GamePreview.Results'
import GamePreviewPrediction from './GamePreview.Prediction'
import * as ResultsCheck from './GamePreview.ResultsCheck'


class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: this.props.game,
      gamePrediction: this.props.gamePrediction ? this.props.gamePrediction : {
        predictionAwayTeamScore: this.props.game.prediction ? this.props.game.prediction.awayTeam.score : null,
        predictionHomeTeamScore: this.props.game.prediction ? this.props.game.prediction.homeTeam.score : null,
        submittingPrediction: (this.props.gamePrediction && this.props.gamePrediction.submittingPrediction) ? this.props.gamePrediction.submittingPrediction : false,
      },
      predictionSpread: null,
      predictionTotal: null,
      oddsPrefix: (this.props.game.odds.spread > 0) ? '+' : '',
    }

  }
  // shouldComponentUpdate(nextProps, nextState) {
    // console.log({nextProps, props: this.props})
    // if (this.props.game !== nextProps.game) return true
    // if (this.props.gamePrediction !== nextProps.gamePrediction) {
    //   console.log(`this.props.gamePrediction: ${this.props.gamePrediction}`);
    //   console.log(`nextProps.gamePrediction: ${nextProps.gamePrediction}`)
    //   return true;
    // }
  //   return true;
  // }
  componentDidUpdate(prevProps, prevState) {
    //console.log('gamePreview updated')
    
    if ((this.props.game !== prevProps.game) || (this.state.game !== prevState.game)) {
      //console.log({newgame: this.props.game});
      this.setState({game: this.props.game})
    }
    if ((this.props.gamePrediction !== prevProps.gamePrediction) || (this.state.gamePrediction !== prevState.gamePrediction)) {
      //console.log({newgamePrediction: this.props.gamePrediction})
      this.setState({gamePrediction: this.props.gamePrediction})
    }
  }
  handleClick = () => {
    this.props.onClick(this.props.game.sport, this.props.game.year, this.props.game.season, this.props.game.gameWeek, this.props.game.gameId);
  }
  
  handleOnChangeStarSpread = (event) => {
    this.props.onChangeStarSpread(this.props.game.gameId, event)
  }

  handleOnChangeStarTotal = (event) => {
    this.props.onChangeStarTotal(this.props.game.gameId, event)
  }

  handleOnChangeGameScore = (event) => {
    this.props.onChangeGameScore(this.props.game.gameId, event)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmitPrediction(this.props.game.gameId)
  }

  submitPrediction = async () => {
    let predictionResponse = await apis.fetchSubmitPrediction()
    console.log('predictionResponse :', predictionResponse);
    // this.setState({ submittingPrediction: false})
  }

  myRef = React.createRef()



  render() {
    const { game, gamePrediction } = this.state;
    
    const date = new Date(game.startDateTime)
    const gameCannotBeUpdated = apis.gameCannotBeUpdated(date)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    const gameDate = date.toLocaleString('en-US', options);
    // console.log({gamePreviewPrediction: gamePrediction})
    
    if (game) { 
      return (
      <div ref={this.myRef} className="link GamePreview">
        <Link to={`/${game.sport}/games/${game.year}/${game.season}/${game.gameWeek}/${game.gameId}`} onClick={this.handleClick}>
          <div className="game-header">
            
          {game.bowlName ? (
            <div className="bowlName">
            {game.bowlName}
            </div>
            ) : null}
          {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}{game.awayTeam.fullName} vs. {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}{game.homeTeam.fullName}
          </div>
        </Link>
        <div className="game-details">
          <div className="headerRow">
            <div className="gameTime">
              {gameDate}
            </div>
            <div className="gameLocation">
              {game.location}
            </div>
            {game.weather ? (
            <div className="gameWeather">
              <div>
              {game.weather.icon === '01d' || game.weather.icon === '01n' ? (
                <i className={`ion-md-sunny`} style={{padding: 6}} />
              ) : (
                <img src={`http://openweathermap.org/img/wn/${game.weather.icon}.png`} className="weatherIcon" />
              )}
              </div>
              <div>{Math.round((game.weather.temp * 1.8) - 459.67)}&deg;F</div>
            </div>
            ) : null}
          </div>
          <div className="headerRow">
            <div></div>
            <div className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</div>
            <div className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</div>
            <div className="odds">Side</div>
            <div className="odds">Total</div>
          </div>

          {(!game.results || game.prediction) ? (
            <GamePreviewPrediction game={game} prediction={game.prediction} gamePrediction={gamePrediction} onChangeGameScore={this.props.onChangeGameScore} onChangeStarSpread={this.props.onChangeStarSpread} onChangeStarTotal={this.props.onChangeStarTotal} />            
          ) : (
            <div>No prediction for this game</div>
          )}
          {game.comparePrediction ? 
            (
              <GamePreviewPrediction game={game} 
              prediction={game.comparePrediction}
              gamePrediction={gamePrediction}
              onChangeGameScore={this.props.onChangeGameScore}
              onChangeStarSpread={this.props.onChangeStarSpread}
              onChangeStarTotal={this.props.onChangeStarTotal}
              />
            ) : 
          (game.crowd && game.crowd.total) ? 
            !game.prediction && !game.results ? 
              (
                <div className="team">
                  Predict to see the Crowd Wisdom
                </div>
              ) 
              : (
                <GamePreviewCrowd game={game} />
                ) 
            : (
              <div className="team">
                No Crowd Prediction Yet
              </div>
              )}
          {game.results ? (
            <GamePreviewResults game={game} />
          ) : (
            <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit} disabled={!game.prediction && !((gamePrediction.predictionAwayTeamScore || gamePrediction.predictionAwayTeamScore ===0 || gamePrediction.predictionAwayTeamScore !== '') && (gamePrediction.predictionHomeTeamScore || gamePrediction.predictionHomeTeamScore === 0))}>
                  {this.props.gamePrediction && this.props.gamePrediction.submittingPrediction ? <Spinner animation='border' /> : game.prediction ? 'Update' : 'Predict'}
                </Button>
              ) : null}
            </div>
          )}
          </div>
        </div>
      );
    }
    return (
      <div></div>
    )
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
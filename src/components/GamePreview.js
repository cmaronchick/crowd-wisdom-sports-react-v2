import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import * as apis from '../apis'
import * as utils from '../utils'
import StarRatingComponent from 'react-star-rating-component'
import GamePreviewCrowd from './GamePreview.Crowd'
import GamePreviewResults from './GamePreview.Results'
import * as ResultsCheck from './GamePreview.ResultsCheck'


class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: this.props.game,
      gamePrediction: {
        predictionAwayTeamScore: (this.props.gamePrediction && this.props.gamePrediction.predictionAwayTeamScore) ? this.props.gamePrediction.predictionAwayTeamScore : this.props.game.prediction ? this.props.game.prediction.awayTeam.score : null,
        predictionHomeTeamScore: (this.props.gamePrediction && this.props.gamePrediction.predictionHomeTeamScore) ? this.props.gamePrediction.predictionHomeTeamScore : this.props.game.prediction ? this.props.game.prediction.homeTeam.score : null,
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
          </div>
          <div className="headerRow">
            <div></div>
            <div className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</div>
            <div className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</div>
            <div className="odds">Side</div>
            <div className="odds">Total</div>
          </div>

          {(!game.results || game.prediction) ? (
            <div>
            <div className="team">
              <div>{(game.prediction || !game.results)  ? (
                  'Me'
                ) : ''}
              </div>
              <div>{game.results ? game.prediction ? (
                <div style={{position: 'relative'}}>
                  {ResultsCheck.checkBullseye(game.prediction.awayTeam.score, game.results.awayTeam.score)}
                  {game.results && (game.prediction.awayTeam.score > game.prediction.homeTeam.score) ? ResultsCheck.straightUpResults(game.results, game.prediction) : null}
                  {game.prediction.awayTeam.score}
                </div>
                ) : 'N/A' : (
                <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={(!game.prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionAwayTeamScore)) ? '##' : null}
                value={(gamePrediction && (gamePrediction.predictionAwayTeamScore || gamePrediction.predictionAwayTeamScore === 0)) ? parseInt(gamePrediction.predictionAwayTeamScore) : 
                  game.prediction ? parseInt(game.prediction.awayTeam.score) : ''} />
              )}
              </div>
              <div>{game.results ? game.prediction ? (
                <div style={{position: 'relative'}}>
                  {ResultsCheck.checkBullseye(game.prediction.homeTeam.score, game.results.homeTeam.score)}
                  {(game.prediction.homeTeam.score > game.prediction.awayTeam.score) ? ResultsCheck.straightUpResults(game.results, game.prediction) : null}
                  {game.prediction.homeTeam.score}
                  </div>
                ) : '' : (
                <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={(!game.prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionHomeTeamScore)) ? '##' : null}
                value={(gamePrediction && (gamePrediction.predictionHomeTeamScore || gamePrediction.predictionHomeTeamScore === 0)) ? parseInt(gamePrediction.predictionHomeTeamScore) : 
                  game.prediction ? game.prediction.homeTeam.score : ''}  />
              )}
              </div>
              <div className="odds">{((game.prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && game.odds) ? (
                <div style={{position: 'relative'}}>
                  {game.results ? ResultsCheck.spreadResults(game.odds, game.results,game.prediction) : null}
                  
                  {game.results ? ResultsCheck.checkBullseye(game.prediction.spread, game.results.spread) : null}
                  {apis.spreadPrediction(game, parseInt(gamePrediction.predictionAwayTeamScore), parseInt(gamePrediction.predictionHomeTeamScore))}<br/>
                  <span className="predictionSpread">(
                  {(gamePrediction.predictionHomeTeamScore + game.odds.spread) > gamePrediction.predictionAwayTeamScore // home team covers
                    ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                      ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                      : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                    : (gamePrediction.predictionHomeTeamScore + game.odds.spread) < gamePrediction.predictionAwayTeamScore 
                      ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                        ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                        : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                      : (gamePrediction.predictionHomeTeamScore + game.odds.spread) === gamePrediction.predictionAwayTeamScore
                        ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                          ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                          : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                        : ''})</span>
                </div>) : ''}
              
              </div>
              <div className="odds">{((game.prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && game.odds) ? (
                <div style={{position: 'relative'}}>
                  
                {game.results ? ResultsCheck.totalResults(game.odds, game.results,game.prediction) : null}
                {game.results ? ResultsCheck.checkBullseye(game.prediction.total, game.results.total) : null}
                {apis.totalPrediction(game, parseInt(gamePrediction.predictionAwayTeamScore), parseInt(gamePrediction.predictionHomeTeamScore))} 
                <br/><span className="predictionSpread">({((game.prediction || (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore)) && game.odds) ? `${gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore}` : ''})</span>
                </div>
              ) : ''}
              </div>
            </div>
            {game.prediction && game.prediction.results ? (
              <div className='predictionScoreBox'>
                Prediction Score: {game.prediction.predictionScore}
              </div>
            ) : null}
            {((game.prediction && game.prediction.awayTeam.score && game.prediction.homeTeam.score) || (gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) ? (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div className='stars'>
                Spread: 
                {!game.results ? (
                  <span>
                    <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsSpread_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                    <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsSpread_0" >
                      <i className="fa fa-minus-circle" aria-hidden="true" onClick={this.handleOnChangeStarTotal}></i>
                    </label>
                  </span>
                ) : null}
                <StarRatingComponent 
                  name={'starsSpread'}
                  editing={!game.results}
                  value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.spread : (game.prediction && game.prediction.stars) ? game.prediction.stars.spread : 0}
                  starCount={3}
                  starColor={(!game.results || (game.prediction && game.prediction.results && game.prediction.results.spread.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                  emptyStarColor={'#f6dfa4'}
                  onStarClick={this.handleOnChangeStarSpread}
                  />
              </div>
              <div className='stars'>
                Total: 
                {!game.results ? (
                  <span>
                    <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsTotal_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                    <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsTotal_0" >
                      <i className="fa fa-minus-circle" aria-hidden="true" onClick={this.handleOnChangeStarTotal}></i>
                    </label>
                  </span>
                ) : null}
                <StarRatingComponent 
                  name='starsTotal'
                  editing={!game.results}
                  value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.total : (game.prediction && game.prediction.stars) ? game.prediction.stars.total : 0}
                  starCount={3}
                  starColor={(!game.results || (game.prediction && game.prediction.results && game.prediction.results.total.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
                  emptyStarColor={'#f6dfa4'}
                  onStarClick={this.handleOnChangeStarTotal}
                  />
              </div>
            </div>
            ) : null}
          </div>
          ) : (
            <div>No prediction for this game</div>
          )}
          {(game.crowd && game.crowd.total) ? (
              <GamePreviewCrowd game={game} />
            ) : !game.prediction ? (
                <div className="team">
                  Predict to see the Crowd Wisdom
                </div>
              ) : (
              <div className="team">
                No Crowd Prediction Yet
              </div>
            )}
          {game.results ? (
            <GamePreviewResults game={game} />
          ) : (
            <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit} disabled={!game.prediction && !(gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)}>
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
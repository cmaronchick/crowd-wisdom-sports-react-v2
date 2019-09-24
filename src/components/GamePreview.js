import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import * as apis from '../api'
import * as utils from '../utils'
import StarRatingComponent from 'react-star-rating-component'

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
      console.log({newgame: this.props.game});
      this.setState({game: this.props.game})
    }
    if ((this.props.gamePrediction !== prevProps.gamePrediction) || (this.state.gamePrediction !== prevState.gamePrediction)) {
      console.log({newgamePrediction: this.props.gamePrediction})
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



  render() {
    const { game, gamePrediction } = this.state;
    
    const date = new Date(game.startDateTime)
    const gameCannotBeUpdated = apis.gameCannotBeUpdated(date)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    const gameDate = date.toLocaleString('en-US', options);
    // console.log({gamePreviewPrediction: gamePrediction})
    
    if (game) { 
      const crowdAwayTeamScore = game.crowd ? parseFloat(game.crowd.awayTeam.score).toFixed(2) : null,
        crowdHomeTeamScore = game.crowd ? parseFloat(game.crowd.homeTeam.score).toFixed(2) : null
      return (
      <div className="link GamePreview">
        <div className="game-header" onClick={this.handleClick}>
        {game.awayTeam.rank ? `#${game.awayTeam.rank} ` : ''}{game.awayTeam.fullName} vs. {game.homeTeam.rank ? `#${game.homeTeam.rank} ` : ''}{game.homeTeam.fullName}
        </div>
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
            <div className="teamName"></div>
            <div className="teamName">{game.awayTeam.code}</div>
            <div className="teamName">{game.homeTeam.code}</div>
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
              <div>{game.results ? game.prediction ? game.prediction.awayTeam.score : 'N/A' : (
                <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={(!game.prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionAwayTeamScore)) ? '##' : null}
                value={(gamePrediction && gamePrediction.predictionAwayTeamScore) ? parseInt(gamePrediction.predictionAwayTeamScore) : 
                  game.prediction ? parseInt(game.prediction.awayTeam.score) : ''} />
              )}
              </div>
              <div>{game.results ? game.prediction ? (
                <div style={{position: 'relative'}}>
                  {game.prediction.homeTeam.score}
                  <i className={`ion-md-add resultIcon ${game.prediction.homeTeam.score > game.prediction.awayTeam.score ? 'resultWin' : ''}`}></i>
                  </div>
                ) : '' : (
                <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={(!game.prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionHomeTeamScore)) ? '##' : null}
                value={(gamePrediction && gamePrediction.predictionHomeTeamScore) ? parseInt(gamePrediction.predictionHomeTeamScore) : 
                  game.prediction ? game.prediction.homeTeam.score : ''}  />
              )}
              </div>
              <div>{((game.prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && game.odds) ? (
                <div>
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
              <div>{((game.prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && game.odds) ? (
                <div>
                {apis.totalPrediction(game, parseInt(gamePrediction.predictionAwayTeamScore), parseInt(gamePrediction.predictionHomeTeamScore))} 
                <br/><span className="predictionSpread">({((game.prediction || (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore)) && game.odds) ? `${gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore}` : ''})</span>
                </div>
              ) : ''}
              </div>
            </div>
            {((game.prediction && game.prediction.awayTeam.score && game.prediction.homeTeam.score) || (gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) ? (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div className='stars'>
                Spread: 
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsSpread_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsSpread_0" >
                  <i className="fa fa-minus-circle" aria-hidden="true" onClick={this.handleOnChangeStarTotal}></i>
                </label>
                <StarRatingComponent 
                  name={'starsSpread'}
                  value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.spread : (game.prediction && game.prediction.stars) ? game.prediction.stars.spread : 0}
                  starCount={3}
                  starColor={'#124734'} /* color of selected icons, default `#ffb400` */
                  emptyStarColor={'#f6dfa4'}
                  onStarClick={this.handleOnChangeStarSpread}
                  />
              </div>
              <div className='stars'>
                Total: 
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsTotal_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsTotal_0" >
                  <i className="fa fa-minus-circle" aria-hidden="true" onClick={this.handleOnChangeStarTotal}></i>
                </label>
                <StarRatingComponent 
                  name='starsTotal'
                  value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.total : (game.prediction && game.prediction.stars) ? game.prediction.stars.total : 0}
                  starCount={3}
                  starColor={'#124734'} /* color of selected icons, default `#ffb400` */
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
            <div className="team">
              <div>Crowd</div>
              <div style={{position: 'relative'}}>
              <span className={(game.results && (game.results.awayTeam.score > game.results.homeTeam.score) && (game.crowd.awayTeam.score > game.crowd.homeTeam.score)) ? 'correctPick' : ''}>
                {crowdAwayTeamScore}
                </span>
              </div>
              <div>
                <span className={(game.results && (game.results.awayTeam.score < game.results.homeTeam.score) && (game.crowd.awayTeam.score < game.crowd.homeTeam.score)) ? 'correctPick' : ''}>
                  {crowdHomeTeamScore}
                </span>
              </div>
              <div>{(game.prediction && game.crowd && game.odds) ? apis.spreadPrediction(game, crowdAwayTeamScore, crowdHomeTeamScore) : ''}<br/>

              <span className="predictionSpread">(
              {(crowdHomeTeamScore + game.odds.spread) > crowdAwayTeamScore // home team covers
                ? crowdAwayTeamScore > crowdHomeTeamScore 
                  ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                  : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                : (crowdHomeTeamScore + game.odds.spread) < crowdAwayTeamScore 
                  ? crowdAwayTeamScore > crowdHomeTeamScore 
                    ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                    : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                  : (crowdHomeTeamScore + game.odds.spread) === crowdAwayTeamScore
                    ? crowdAwayTeamScore > crowdHomeTeamScore 
                      ? `${game.awayTeam.code} by ${(crowdAwayTeamScore - crowdHomeTeamScore).toFixed(2)}`
                      : `${game.homeTeam.code} by ${(crowdHomeTeamScore - crowdAwayTeamScore).toFixed(2)}`
                    : ''}
              )</span>
              </div>
              <div>{(game.prediction && game.crowd && game.odds) ? (
                <div>
                {apis.totalPrediction(game, crowdAwayTeamScore, crowdHomeTeamScore)}
                <br/><span className="predictionSpread">({game.crowd.total})</span>
                </div>
              ) : ''}</div>
            </div>
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
            <div className="team">
              <div>FINAL</div>
              <div>{game.results.awayTeam.score}</div>
              <div>{game.results.homeTeam.score}</div>
              <div>{apis.spreadPrediction(game,game.results.awayTeam.score, game.results.homeTeam.score)}<br/>
              <span className="predictionSpread">(
              {(game.results.homeTeam.score + game.odds.spread) > game.results.awayTeam.score // home team covers
                ? game.results.awayTeam.score > game.results.homeTeam.score 
                  ? `${game.awayTeam.code} by ${(game.results.awayTeam.score - game.results.homeTeam.score)}`
                  : `${game.homeTeam.code} by ${(game.results.homeTeam.score - game.results.awayTeam.score)}`
                : (game.results.homeTeam.score + game.odds.spread) < game.results.awayTeam.score 
                  ? game.results.awayTeam.score > game.results.homeTeam.score 
                    ? `${game.awayTeam.code} by ${(game.results.awayTeam.score - game.results.homeTeam.score)}`
                    : `${game.homeTeam.code} by ${(game.results.homeTeam.score - game.results.awayTeam.score)}`
                  : (game.results.homeTeam.score + game.odds.spread) === game.results.awayTeam.score
                    ? game.results.awayTeam.score > game.results.homeTeam.score 
                      ? `${game.awayTeam.code} by ${(game.results.awayTeam.score - game.results.homeTeam.score)}`
                      : `${game.homeTeam.code} by ${(game.results.homeTeam.score - game.results.awayTeam.score)}`
                    : ''}
              )</span></div>
              <div>{apis.totalPrediction(game,game.results.awayTeam.score, game.results.homeTeam.score)}<br/>({game.results.awayTeam.score + game.results.homeTeam.score})</div>
            </div>
          ) : (
            <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit} disabled={!game.prediction && !(gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)}>
                  {this.state.gamePrediction.submittingPrediction ? <Spinner animation='border' /> : game.prediction ? 'Update' : 'Predict'}
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
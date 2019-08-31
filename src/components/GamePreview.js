import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import * as apis from '../api'

class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: this.props.game,
      gamePrediction: {
        predictionAwayTeamScore: (this.props.gamePrediction && this.props.gamePrediction.predictionAwayTeamScore) ? this.props.gamePrediction.predictionAwayTeamScore : this.props.game.prediction ? this.props.game.prediction.awayTeam.score : null,
        predictionHomeTeamScore: (this.props.gamePrediction && this.props.gamePrediction.predictionHomeTeamScore) ? this.props.gamePrediction.predictionHomeTeamScore : this.props.game.prediction ? this.props.game.prediction.homeTeam.score : null,
      },
      predictionSpread: null,
      predictionTotal: null,
      oddsPrefix: (this.props.game.odds.spread > 0) ? '+' : ''
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
    
    if (this.props.game !== prevProps.game) {
      this.setState({game: this.props.game})
    }
    if (this.props.gamePrediction !== prevProps.gamePrediction) {
      this.setState({gamePrediction: this.props.gamePrediction})
    }
  }
  handleClick = () => {
    this.props.onClick(this.props.game.sport, this.props.game.year, this.props.game.season, this.props.game.gameWeek, this.props.game.gameId);
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
    //this.setState({ game: predictionResponse.game})
  }



  render() {
    const { game, gamePrediction } = this.state;
    
    const date = new Date(game.startDateTime)
    const gameCannotBeUpdated = apis.gameCannotBeUpdated(date)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    const gameDate = date.toLocaleString('en-US', options);
    //console.log({gamePreviewGame: game, gamePreviewPrediction: gamePrediction})
    
    if (game) { 
      return (
      <div className="link GamePreview">
        <div className="game-header" onClick={this.handleClick}>
          {game.awayTeam.fullName} vs. {game.homeTeam.fullName}
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
            <div className="teamName">{game.awayTeam.shortName}</div>
            <div className="teamName">{game.homeTeam.shortName}</div>
            <div className="odds">Side</div>
            <div className="odds">Total</div>
          </div>

          {(!game.results || game.prediction) ? (
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
            <div>{game.results ? game.prediction ? game.prediction.homeTeam.score : '' : (
              <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={(!game.prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionHomeTeamScore)) ? '##' : null}
              value={(gamePrediction && gamePrediction.predictionHomeTeamScore) ? parseInt(gamePrediction.predictionHomeTeamScore) : 
                game.prediction ? game.prediction.homeTeam.score : ''}  />
            )}
            </div>
            <div>{(game.prediction && game.odds) ? apis.oddsPrediction(game, gamePrediction) : null}</div>
            <div>{(game.prediction && game.odds) ? game.prediction.total : null}</div>
          </div>
          ) : (
            <div>No prediction for this game</div>
          )}
          {(game.crowd && game.crowd.total) ? (
            <div className="team">
              <div>Crowd</div>
              <div>{game.crowd.awayTeam.score}</div>
              <div>{game.crowd.homeTeam.score}</div>
              <div>{game.crowd.spread}</div>
              <div>{game.crowd.total}</div>
            </div>
            ) : (
              <div className="team">
                No Crowd Prediction Yet
              </div>
            )}
          {/* {game.crowd.awayTeam.score}<br/>
          {game.crowd.homeTeam.score} */}
          {game.results ? (
            <div className="team">
              <div>FINAL</div>
              <div>{game.results.awayTeam.score}</div>
              <div>{game.results.homeTeam.score}</div>
              <div>{game.results.spread}</div>
              <div>{game.results.total}</div>
            </div>
          ) : (
            <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit}>{game.prediction ? 'Update' : 'Predict'}</Button>
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
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import * as apis from '../api'

class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      predictionSpread: null,
      predictionTotal: null,
      oddsPrefix: (this.props.odds.spread > 0) ? '+' : ''
    }

  }
  
  componentDidUpdate() {
    //console.log('gamePreview updated')
  }
  handleClick = () => {
    this.props.onClick(this.props.sport, this.props.year, this.props.season, this.props.gameWeek, this.props.gameId);
  }

  handleOnChangeGameScore = (event) => {
    this.props.onChangeGameScore(this.props.gameId, event)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmitPrediction(this.state.gameId)
  }

  submitPrediction = async () => {
    let predictionResponse = await apis.fetchSubmitPrediction()
    console.log('predictionResponse :', predictionResponse);
    //this.setState({ game: predictionResponse.game})
  }



  render() {
    //console.log('game preview')
    const game = this.state;
    return (
    <div className="link GamePreview">
      <div className="game-header" onClick={this.handleClick}>
        {this.props.awayTeam.fullName} vs. {this.props.homeTeam.fullName}
      </div>
      <div className="game-details">
        <div className="headerRow">
          <div className="teamName"></div>
          <div className="teamName">{game.awayTeam.shortName}</div>
          <div className="teamName">{game.homeTeam.shortName}</div>
          <div className="odds">Side</div>
          <div className="odds">Total</div>
          {game.results ? (
          <div>Results</div>
          ) : null}
        </div>

        {!game.results ? (
        <div className="team">
          <div className="teamName">{(game.prediction || !game.results)  ? (
              'Me'
            ) : ''}
          </div>
          <div>{game.results ? game.prediction ? game.prediction.awayTeam.score : '' : (
            <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={!game.prediction ? '##' : null} value={game.prediction ? game.prediction.awayTeam.score : ''} />
          )}
          </div>
          <div>{game.results ? game.prediction ? game.prediction.homeTeam.score : '' : (
            <input style={{width: 50}} onChange={this.handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={!game.prediction ? '##' : null} value={game.prediction ? game.prediction.homeTeam.score : ''}  />
          )}
          </div>
          <div>{(game.prediction && game.odds) ? (game.prediction.spread > game.odds.spread) ? `${game.awayTeam.code} ${this.state.oddsPrefix}${game.odds.spread}` : (game.prediction.spread < game.odds.spread) ? `${game.homeTeam.code} ${this.state.oddsPrefix}${game.odds.spread}` : (game.prediction.spread === game.odds.spread) ? 'PUSH' : null : null}</div>
          <div>{(game.prediction && game.odds) ? game.prediction.total : null}</div>
        </div>
        ) : (
          <div>No prediction for this game</div>
        )}
        </div>
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
            <div></div>
            <div>{game.results.awayTeam.score}</div>
            <div>{game.results.homeTeam.score}</div>
            <div>{game.results.spread}</div>
            <div>{game.results.total}</div>
          </div>
        ) : (
          <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button type='submit' onClick={this.handleSubmit}>{game.prediction ? 'Update' : 'Predict'}</Button>
          </div>
        )}
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
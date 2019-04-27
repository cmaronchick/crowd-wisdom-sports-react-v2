import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'

class GamePreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props
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



  render() {
    console.log('gamepreview 30 props: ', this.props)
    const game = this.props;
    return (
    <div className="link GamePreview">
      <div className="game-header" onClick={this.handleClick}>
        {this.props.awayTeam.fullName} vs. {this.props.homeTeam.fullName}
      </div>
      <div className="game-details">
        <div className="headerRow">
          <div className="teamName"></div>
          <div>{(game.prediction || !game.results)  ? (
              'Me'
            ) : ''}</div>
          <div>Crowd</div>
          {game.results ? (
          <div>Results</div>
          ) : null}
        </div>
        <div className="team">
          <div className="teamName">{game.awayTeam.shortName}</div>
          <div>{game.results ? game.prediction ? game.prediction.awayTeam.score : '' : (
            <input onChange={this.handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={game.prediction ? game.prediction.awayTeam.score : '##'} />
          )}
          </div>
          <div>
            {game.crowd ? game.crowd.awayTeam.score : 'No Crowd Prediction Yet'}
          </div>
          {game.results ? (
            <div>{game.results.awayTeam.score}</div>
          ) : null}
        </div>
        <div className="team">
          <div className="teamName">{game.homeTeam.shortName}</div>
          <div>{game.results ? game.prediction ? game.prediction.homeTeam.score : '' : (
            <input onChange={this.handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={game.prediction ? game.prediction.homeTeam.score : '##'} />
          )}
          </div>
          <div>{game.crowd ? game.crowd.homeTeam.score : 'No Crowd Prediction Yet'}</div>
          {game.results ? (
            <div>{game.results.homeTeam.score}</div>
          ) : null}
        </div>
        {/* {game.crowd.awayTeam.score}<br/>
        {game.crowd.homeTeam.score} */}
        {!game.results ? (
          <div style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Button type='submit' onClick={this.handleSubmit}>{game.prediction ? 'Update' : 'Predict'}</Button>
          </div>
        ) : null}
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
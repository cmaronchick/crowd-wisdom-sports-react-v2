import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import * as apis from '../apis'
import StarRatingComponent from 'react-star-rating-component'
import GamePreviewCrowd from './GamePreview.Crowd'
import GamePreviewResults from './GamePreview.Results'
import GamePreviewPrediction from './GamePreview.Prediction'
import GamePreviewPredictionQuarters from './GamePreview.Prediction.Quarters'
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
      oddsChangeModalShow: false,
      showQuarters: this.props.game.season === "post" && this.props.game.gameWeek === 4 ? true : false
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
  componentDidMount() {
    const { season, gameWeek } = this.state.game
    //check for super bowl and set quarters state
    if (gameWeek === 4 && season === 'post') {
      this.setState({
        periods: this.state.game.prediction && this.state.game.prediction.periods ? {...this.state.game.prediction.periods} : {
          awayTeam: {
            q1: '',
            q2: '',
            q3: '',
            q4: ''
          },
          homeTeam: {
            q1: '',
            q2: '',
            q3: '',
            q4: ''
          }
        },
        showQuarters: true,
      })
    }

  }
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
  handleOnChangeTextQuarters = (team, quarter, event) => {
    console.log('event', event)
    let { value } = event.target
    let periodsObj = {...this.state.periods}
    let teamScore = 0
    let teamKey = team === 'awayTeam' ? 'awayTeamScore' : 'homeTeamScore'
    if (!isNaN(value)) {
      periodsObj[team][quarter] = parseInt(value)
      Object.keys(periodsObj[team]).forEach(key => {
        teamScore += isNaN(periodsObj[team][key]) ? 0 : parseInt(periodsObj[team][key])
      })
      console.log({periodsObj, teamScore})
      this.setState({periods: periodsObj})
      this.handleOnChangeGameScore({ target: { name: team === 'awayTeam' ? 'predictionAwayTeamScore' : 'predictionHomeTeamScore', value: teamScore }})
    }
    if (value === '') {
      periodsObj[team][quarter] = value
      this.setState({periods: periodsObj})
    }
    this.props.handleOnChangeTextQuarters(team, quarter, event)
  }
  
  handleShowQuarters = () => {
    this.setState({ showQuarters: true})
  }
  handleHideQuarters = () => {
    this.setState({ showQuarters: false})
  }


  handleOddsChangeModalShow = () => {
    this.setState({ oddsChangeModalShow: true})
  }

  handleOddsChangeModalHide = () => {
    this.setState({ oddsChangeModalShow: false })
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
              <div>{game.weather.temp}&deg;F</div>
            </div>
            ) : null}
          </div>
          <div className="headerRow">
            <div></div>
            <div className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</div>
            <div className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</div>
            {(gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) || game.prediction ? (
            <div className="odds">Side</div>
            ) : null}
            {(gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) || game.prediction ? (
            <div className="odds">Total</div>
            ) : null} 
          </div>

          {(!game.results || game.prediction) ? (
            <GamePreviewPrediction
              game={game}
              prediction={game.prediction}
              gamePrediction={gamePrediction}
              onChangeGameScore={this.props.onChangeGameScore}
              onChangeStarSpread={this.props.onChangeStarSpread}
              onChangeStarTotal={this.props.onChangeStarTotal}
              handleOddsChangeModalShow={this.handleOddsChangeModalShow}
              handleOddsChangeModalHide={this.handleOddsChangeModalHide}
              oddsChangeModalShow={this.state.oddsChangeModalShow} />            
          ) : (
            <div>No prediction for this game</div>
          )}
          
          {(game.season === 'post' && game.gameWeek === 4) && (game.prediction || !game.results) ? (
            <div>
              <Button onClick={()=> {
                this.state.showQuarters ? this.handleHideQuarters() : this.handleShowQuarters()
              }}>{this.state.showQuarters ? 'Hide Quarters' : 'Show Quarters'}</Button>
              <GamePreviewPredictionQuarters
                game={game}
                periods={this.state.periods}
                type={{type: 'user', title: 'Me'}} 
                onChangeTextQuarters={this.handleOnChangeTextQuarters}
                />
            </div>
          ) : null} 
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
          (game.crowd && game.crowd.awayTeam) ? 
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
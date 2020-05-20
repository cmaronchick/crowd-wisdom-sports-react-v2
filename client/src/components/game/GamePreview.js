import React from 'react';
import PropTypes from 'prop-types'

import { Card, Button, Spinner, Row, Col, Typography } from 'antd'
// import * as apis from '../apis'
import GamePreviewHeader from './GamePreview.Header'
import GamePreviewCrowd from './GamePreview.Crowd'
import GamePreviewResults from './GamePreview.Results'
import GamePreviewPrediction from './GamePreview.Prediction'
import GamePreviewPredictionQuarters from './GamePreview.Prediction.Quarters'
import * as ResultsCheck from './GamePreview.ResultsCheck'

import './Game.css'

const { Title, Paragraph, Text } = Typography

const GamePreview = (props) => {
  const { game, gamePrediction } = props
  if (!game || !game.gameId) {
    return (
      <div>No game found</div>
    )
  }
  const oddsPrefix = game.odds.spread > 0 ? '+' : '';
  const showQuarters = game.season === "post" && game.gameWeek === 4 ? true : false
  
  const { season, gameWeek } = game
  const showPrediction = (gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) || game.prediction
  //check for super bowl and set quarters state
  let periods = {};
  if (gameWeek === 4 && season === 'post') {
      periods = game.prediction && game.prediction.periods ? {...game.prediction.periods} : {
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
      }
      const showQuarters = true
  }

  const handleClick = () => {
    props.onClick(game.sport, game.year, game.season, game.gameWeek, game.gameId);
  }

  
  const handleOnChangeStarSpread = (event) => {
    this.props.onChangeStarSpread(this.props.game.gameId, event)
  }

  const handleOnChangeStarTotal = (event) => {
    this.props.onChangeStarTotal(this.props.game.gameId, event)
  }

  const handleOnChangeGameScore = (event) => {
    this.props.onChangeGameScore(this.props.game.gameId, event)
  }
  const handleOnChangeTextQuarters = (team, quarter, event) => {
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
  
  const handleShowQuarters = () => {
    this.setState({ showQuarters: true})
  }
  const handleHideQuarters = () => {
    this.setState({ showQuarters: false})
  }


  const handleOddsChangeModalShow = () => {
    this.setState({ oddsChangeModalShow: true})
  }

  const handleOddsChangeModalHide = () => {
    this.setState({ oddsChangeModalShow: false })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmitPrediction(this.props.game.gameId)
  }
    
    const date = new Date(game.startDateTime)
    // const gameCannotBeUpdated = apis.gameCannotBeUpdated(date)
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit', hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
    const gameDate = date.toLocaleString('en-US', options);
    // console.log({gamePreviewPrediction: gamePrediction})
    
      return (
      <Card title={<GamePreviewHeader game={game} onClick={handleClick} />} className="link GamePreview">
        <Row className="game-details">
          <Col span={24}>
            <Row className="headerRow">
              <Col span={8}>
                <Text className="gameDate">
                {gameDate}
                </Text>
              </Col>
              <Col span={8}>
              <Text className="gameLocation">
                {game.location}
              </Text>
              </Col>
              {game.weather ? (
              <Col span={8} className="gameWeather">
                <Text>
                  <img src={`http://openweathermap.org/img/wn/${game.weather.icon}.png`} className="weatherIcon" />
                
                </Text>
                <Text>{game.weather.temp}&deg;F</Text>
              </Col>
              ) : null}
            </Row>
            <Row className="headerRow">
              <Col span={4}></Col>
              <Col span={showPrediction ? 5 : 10} className={`teamName ${game.awayTeam.code.toLowerCase()} secondary`}>{game.awayTeam.code}</Col>
              <Col span={showPrediction ? 5 : 10} className={`teamName ${game.homeTeam.code.toLowerCase()} primary`}>{game.homeTeam.code}</Col>
              {showPrediction ? (
              <Col span={5} className="odds">Side</Col>
              ) : null}
              {showPrediction ? (
              <Col span={5} className="odds">Total</Col>
              ) : null} 
            </Row>

          {(!game.results || game.prediction) ? (
            <GamePreviewPrediction
              showPrediction={showPrediction}
              game={game}
              prediction={game.prediction}
              gamePrediction={gamePrediction ? gamePrediction : game.prediction}
              // onChangeGameScore={onChangeGameScore}
              // onChangeStarSpread={onChangeStarSpread}
              // onChangeStarTotal={onChangeStarTotal}
              handleOddsChangeModalShow={handleOddsChangeModalShow}
              handleOddsChangeModalHide={handleOddsChangeModalHide}
              // oddsChangeModalShow={oddsChangeModalShow}
              />
          ) : (
            <Row>
            <div>No prediction for this game</div>
            </Row>
          )}
          
          {(game.season === 'post' && game.gameWeek === 4) && (game.prediction || !game.results) && (
            <Row>
              <Button onClick={()=> {
                showQuarters ? handleHideQuarters() : handleShowQuarters()
              }}>{showQuarters ? 'Hide Quarters' : 'Show Quarters'}</Button>
              <GamePreviewPredictionQuarters
                game={game}
                periods={periods}
                type={{type: 'user', title: 'Me'}} 
                onChangeTextQuarters={handleOnChangeTextQuarters}
                />
            </Row>
          )} 
          {game.comparePrediction ? 
            (
              <Row>
              <GamePreviewPrediction game={game} 
              prediction={game.comparePrediction}
              gamePrediction={gamePrediction}
              // onChangeGameScore={this.props.onChangeGameScore}
              // onChangeStarSpread={this.props.onChangeStarSpread}
              // onChangeStarTotal={this.props.onChangeStarTotal}
              />
              </Row>
            ) : 
          (game.crowd && game.crowd.awayTeam) ? (
            <Row>
            {!game.prediction && !game.results ? 
              (
                <div className="team">
                  Predict to see the Crowd Wisdom
                </div>
              ) 
              : (
                <GamePreviewCrowd game={game} />
                )}
            </Row>
            ) : (
              <Row className="team">
                No Crowd Prediction Yet
              </Row>

              )}
          {game.results ? (
            <Row>
              <GamePreviewResults game={game} />
            </Row>
          ) : (
            <Row style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {/* {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit} disabled={!game.prediction && !((gamePrediction.predictionAwayTeamScore || gamePrediction.predictionAwayTeamScore ===0 || gamePrediction.predictionAwayTeamScore !== '') && (gamePrediction.predictionHomeTeamScore || gamePrediction.predictionHomeTeamScore === 0))}>
                  {this.props.gamePrediction && this.props.gamePrediction.submittingPrediction ? <Spinner animation='border' /> : game.prediction ? 'Update' : 'Predict'}
                </Button>
              ) : null} */}
            </Row>
          )}
          </Col>
          </Row>
          
        </Card>
      );
}

GamePreview.propTypes = {
  onClick: PropTypes.func.isRequired,
  game: PropTypes.object.isRequired,
  gamePrediction: PropTypes.object.isRequired
}


export default GamePreview;
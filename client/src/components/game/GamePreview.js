import React, { Fragment } from 'react';
import PropTypes from 'prop-types'

import { Card, Button, Spinner, Row, Col, Typography } from 'antd'
// import * as apis from '../apis'
import GamePreviewHeader from './GamePreview.Header'
import GamePreviewCrowd from './GamePreview.Crowd'
import GamePreviewResults from './GamePreview.Results'
import GamePreviewPrediction from './GamePreview.Prediction'
import GamePreviewPredictionQuarters from './GamePreview.Prediction.Quarters'
import * as ResultsCheck from './GamePreview.ResultsCheck'
import GamePreviewHeaderRow from './GamePreview.HeaderRow'
import './Game.less'

const { Title, Paragraph, Text } = Typography

const GamePreview = (props) => {
  const { game, predictions } = props
  if (!game || !game.gameId) {
    return (
      <div>No game found</div>
    )
  }
  const oddsPrefix = game.odds.spread > 0 ? '+' : '';
  const showQuarters = game.season === "post" && game.gameWeek === 4 ? true : false
  
  const { season, gameWeek } = game
  const showPrediction = predictions && predictions.length > 0
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
    //console.log('predictions', predictions);
      return (
      <Card title={<GamePreviewHeader game={game} onClick={handleClick} />} className="link GamePreview">
        <Row className="game-details">
          <Col span={24}>
            <GamePreviewHeaderRow game={game} showPrediction={showPrediction}/>

          {!game.results ? (
              <GamePreviewPrediction
                showPrediction={showPrediction}
                game={game}
                prediction={game.prediction ? game.prediction : { type: 'user', name: 'Me'}}
                // override game.prediction with temporary gamePrediction
                // onChangeGameScore={onChangeGameScore}
                // onChangeStarSpread={onChangeStarSpread}
                // onChangeStarTotal={onChangeStarTotal}
                handleOddsChangeModalShow={handleOddsChangeModalShow}
                handleOddsChangeModalHide={handleOddsChangeModalHide}
                // oddsChangeModalShow={oddsChangeModalShow}
                />
          ) : predictions && predictions.length > 0 ? predictions.map(prediction => (
            <GamePreviewPrediction
            key={prediction.name}
            showPrediction={showPrediction}
            game={game}
            prediction={prediction}
            // override game.prediction with temporary gamePrediction
            // onChangeGameScore={onChangeGameScore}
            // onChangeStarSpread={onChangeStarSpread}
            // onChangeStarTotal={onChangeStarTotal}
            handleOddsChangeModalShow={handleOddsChangeModalShow}
            handleOddsChangeModalHide={handleOddsChangeModalHide}
            // oddsChangeModalShow={oddsChangeModalShow}
            />
          )) : (
            <Row className="predictionRow noPrediction">
              <Col span={24}>
                <Text type="warning">No prediction for this game</Text>
              </Col>
            </Row>
          )}
          {(game.season === 'post' && game.gameWeek === 4) && (game.prediction || !game.results) && (
            <Fragment>

              {/* <Button onClick={()=> {
                showQuarters ? handleHideQuarters() : handleShowQuarters()
              }}>{showQuarters ? 'Hide Quarters' : 'Show Quarters'}</Button>
              <GamePreviewPredictionQuarters
                game={game}
                periods={periods}
                predictionType={{type: 'user', title: 'Me'}} 
                onChangeTextQuarters={handleOnChangeTextQuarters}
                /> */}
            </Fragment>
          )} 
          {/* {game.comparePrediction ? 
            (
              <GamePreviewPrediction game={game} 
              prediction={game.comparePrediction}
              gamePrediction={gamePrediction}
              predictionType={{type: 'user', title: 'Crowd'}}
              user={props.compareUser}
              // onChangeGameScore={this.props.onChangeGameScore}
              // onChangeStarSpread={this.props.onChangeStarSpread}
              // onChangeStarTotal={this.props.onChangeStarTotal}
              />
            ) :  */}
          {(game.crowd && game.crowd.awayTeam) ? (
            <Fragment>
            {!game.prediction && !game.results ? 
              (
                <div className="team">
                  Predict to see the Crowd Wisdom
                </div>
              ) 
              : (
                // <GamePreviewCrowd game={game} />
                <GamePreviewPrediction
                  game={game}
                  prediction={{...game.crowd, type: 'crowd', name: 'Crowd'}}
                  user="Crowd"
                  showPrediction={true}
                  predictionType={{type: 'crowd', title: 'Crowd'}} />
                )}
            </Fragment>
            ) : (
              <Row className="team">
                <Col span={24}>
                <Title level={3}>No Crowd Prediction Yet</Title>
                </Col>
              </Row>

              )}
          {game.results ? (
              <GamePreviewResults game={game} />
          ) : (
            <Row style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {/* {!gameCannotBeUpdated ? (
                <Button type='submit' style={{width: '100%'}} onClick={this.handleSubmit} disabled={!game.prediction && !((gamePrediction.predictionAwayTeamScore || gamePrediction.predictionAwayTeamScore ===0 || gamePrediction.predictionAwayTeamScore !== '') && (gamePrediction.predictionHomeTeamScore || gamePrediction.predictionHomeTeamScore === 0))}>
                  {this.props.gamePrediction && this.props.gamePrediction.submittingPrediction ? <Spinner animation='border' /> : game.prediction ? 'Update' : 'Predict'}
                </Button>
              ) : null} */}\

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
  gamePrediction: PropTypes.object,
  users: PropTypes.array
}


export default GamePreview;
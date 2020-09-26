import React, { Fragment } from 'react'
import { Row, Col, Typography, Form, Input, InputNumber } from 'antd'
import StarRatingComponent from 'react-star-rating-component'
import OddsChangeModal from './Game.OddsChangeModal';
import { checkBullseye, straightUpResults, spreadResults, totalResults } from './GamePreview.ResultsCheck'
import GamePreviewStakes from './GamePreview.Stakes'
import { spreadPrediction, totalPrediction, checkGameStart } from '../../functions/utils'
import { toggleOddsModal } from '../../redux/actions/uiActions';

import { WarningOutlined } from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const GamePreviewPrediction = (props) => {
  const { 
    game,
    prediction,
    showPrediction,
    toggleOddsChangeModal,
    user
  } = props

    const handleOnChangeGameScore = (event) => {
      console.log('event.target', event.target)
        props.handleChangeGameScore(game.gameId, event)
    }
    
    const { results } = game
    const { odds } = prediction && prediction.odds ? prediction : game
    
    let awayTeamSpreadResult, homeTeamSpreadResult, totalResult;
    if (prediction.awayTeam && prediction.awayTeam.score && prediction.homeTeam && prediction.homeTeam.score) {
      awayTeamSpreadResult = (prediction.awayTeam.score - prediction.homeTeam.score) % 1 === 0 ? (prediction.awayTeam.score - prediction.homeTeam.score) : (prediction.awayTeam.score - prediction.homeTeam.score).toFixed(2)
      homeTeamSpreadResult = (prediction.homeTeam.score - prediction.awayTeam.score) % 1 === 0 ? (prediction.homeTeam.score - prediction.awayTeam.score) : (prediction.homeTeam.score - prediction.awayTeam.score).toFixed(2)
      totalResult = (prediction.awayTeam.score + prediction.homeTeam.score) % 1 === 0 ? (prediction.awayTeam.score + prediction.homeTeam.score) : (prediction.awayTeam.score + prediction.homeTeam.score).toFixed(2)
    }

    const gameCannotBeUpdated = checkGameStart(game.startDateTime)
    if (!prediction && results) {
      
      return (<Row className="predictionRow noPrediction"><Col span={24}>No prediction submitted</Col></Row>)
    }
    if (prediction.type === 'user') {
      // console.log('prediction', prediction, prediction.awayTeam, prediction.awayTeam.score, prediction.awayTeam.score !== null)
    }
    return (
      <Row className={`${prediction.type === 'crowd' && (`crowdRow`)} predictionRow`}>
        <Col span={24}>
          <Row style={{flexFlow: 'nowrap'}}>
            <Col span={4} className="team">
              <Text>{prediction.name && (prediction.name.length <= 5 ? prediction.name : `${prediction.name.substring(0, 4)}...`)}</Text>
            </Col>
            <Col span={showPrediction ? 5 : 10}>{game.results ? prediction ? (
                <div style={{position: 'relative'}}>
                  {results && prediction && (checkBullseye(prediction.awayTeam.score, results.awayTeam.score))}
                  {results && prediction && (prediction.awayTeam.score > prediction.homeTeam.score) && (straightUpResults(results, prediction))}
                  {prediction.awayTeam.score}
                </div>
                ) : '' : prediction.type === 'user' ? (
                  <Form
                  initialValues={
                    {
                      awayTeam: prediction && prediction.awayTeam && prediction.awayTeam.score ? prediction.awayTeam.score : null
                    }
                  }
                  name={`${game.gameId}awayTeam`}>
                  <Form.Item
                  name="awayTeam"
                  id={`${game.gameId}awayTeam`}>
                    <Input
                    disabled={gameCannotBeUpdated || !user.authenticated}
                    type="number"
                    style={{width: '100%'}}
                    onChange={handleOnChangeGameScore}
                    name='awayTeam'
                    id={`${game.gameId}awayTeam_input`}
                    placeholder={`${(!prediction || (prediction && !prediction.awayTeam) || (prediction && prediction.awayTeam && !prediction.awayTeam.score)) ? ('##') : null}`}
                     />
                  </Form.Item>
                  </Form>
              ) : (
                <Text>{prediction.awayTeam ? prediction.awayTeam.score : ''}</Text>
              )}
            </Col>
            <Col span={showPrediction ? 5 : 10}>
              {game.results ? prediction ? (
                <div style={{position: 'relative'}}>
                  {checkBullseye(prediction.homeTeam.score, results.homeTeam.score)}
                  {(prediction.homeTeam.score > prediction.awayTeam.score) ? straightUpResults(results, prediction) : null}
                  {prediction.homeTeam.score}
                  </div>
                ) : '' : prediction.type === 'user' ? (
                  <Form
                  initialValues={
                    {
                      homeTeam: prediction && prediction.homeTeam && prediction.homeTeam.score ? prediction.homeTeam.score : null
                    }
                  }
                  name={`${game.gameId}homeTeam`}>
                  <Form.Item
                      id={`${game.gameId}homeTeam`}
                  name="homeTeam">
                    <Input
                      disabled={gameCannotBeUpdated || !user.authenticated}
                      style={{width: '100%'}}
                      type="number"
                      onChange={handleOnChangeGameScore}
                      name='homeTeam'
                      id={`${game.gameId}homeTeam_input`}
                      placeholder={`${(!prediction || (prediction && !prediction.homeTeam) || (prediction && prediction.homeTeam && !prediction.homeTeam.score)) ? '##' : null}`}
                      value={(prediction && prediction.homeTeam && prediction.homeTeam.score !== null) ? prediction.homeTeam.score : ''}
                      />
                  </Form.Item>
                  </Form>
              ) : (
                <Text>{prediction.homeTeam ? prediction.homeTeam.score : ''}</Text>
              )}
            </Col>
            {showPrediction && (
            <Col span={5} className="odds">
              {(showPrediction && odds && prediction.awayTeam && prediction.homeTeam) && (
                <div style={{position: 'relative'}}>
                  {results ? spreadResults(odds, results,prediction) : null}
                  
                  {results ? checkBullseye(prediction.spread, results.spread) : null}
                  {spreadPrediction(game, odds, prediction.awayTeam.score, prediction.homeTeam.score)}
                  {document.width > 500 && (
                  <Fragment>
                  <br/>
                  <span className="predictionSpread">(
                  {(prediction.homeTeam.score + odds.spread) > prediction.awayTeam.score // home team covers
                    ? prediction.awayTeam.score > prediction.homeTeam.score 
                      ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                      : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                    : (prediction.homeTeam.score + odds.spread) < prediction.awayTeam.score 
                      ? prediction.awayTeam.score > prediction.homeTeam.score 
                        ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                        : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                      : (prediction.homeTeam.score + odds.spread) === prediction.awayTeam.score
                        ? prediction.awayTeam.score > prediction.homeTeam.score 
                          ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                          : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                        : ''})</span>
                  </Fragment>
                  )}
                </div>)}
              
              </Col>
              )}
              {showPrediction && (
              <Col span={5} className="odds">
                {(showPrediction && odds && prediction.awayTeam && prediction.homeTeam) && (
                <div style={{position: 'relative'}}>
                  
                {results ? totalResults(odds, results,prediction) : null}
                {results ? checkBullseye(prediction.total, results.total) : null}
                {totalPrediction(game, odds, prediction.awayTeam.score, prediction.homeTeam.score)} 
                {document.width > 500 && (
                  <Fragment>
                    <br/><span className="predictionSpread">({((prediction || (prediction.awayTeam.score + prediction.homeTeam.score)) && odds) ? `${totalResult}` : ''})</span>
                    </Fragment>
                  )}
                </div>
              )}
              </Col>
              )}
            </Row>
        {prediction && prediction.results ? (
          <Row className='predictionScoreBox'>
            <Col span={24}>
              Prediction Score: {prediction.predictionScore ? prediction.predictionScore : prediction.results.predictionScore ? prediction.results.predictionScore : 0}
            </Col>
          </Row>
        ) : null}
        {prediction.awayTeam && prediction.homeTeam && prediction.type !== 'crowd' && (<GamePreviewStakes game={game} prediction={prediction} />)}

        {prediction && prediction.odds && ((game.odds.spread !== prediction.odds.spread) || (game.odds.total !== prediction.odds.total)) ? (
          !game.results ? (
            <Row className="oddsChangeAlert alertText"
            onClick={() => toggleOddsChangeModal(game, prediction)}>
              <Col span={24}>
                <Text type="warning"><WarningOutlined /> - Odds have changed</Text>
                </Col>
            </Row>
          ) : game.odds && (
            <Row className="oddsChangeAlert">
              <Col span={24}>
              Final Game Odds:<br/>
              Spread: {game.odds.spread} | Total: {game.odds.total}
              </Col>
            </Row>
          )
        ) : null}

        </Col>
      </Row>
    )
}

export default GamePreviewPrediction

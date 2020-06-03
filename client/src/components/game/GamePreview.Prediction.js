import React from 'react'
import { Row, Col, Typography } from 'antd'
import StarRatingComponent from 'react-star-rating-component'
import OddsChangeModal from './Game.OddsChangeModal';
import { checkBullseye, straightUpResults, spreadResults, totalResults } from './GamePreview.ResultsCheck'
import GamePreviewStakes from './GamePreview.Stakes'
import { spreadPrediction, totalPrediction } from '../../functions/utils'

const { Title, Text, Paragraph } = Typography

const GamePreviewPrediction = (props) => {
  const { 
    game,
    prediction,
    gamePrediction,
    showPrediction,
    predictionType,
    onChangeGameScore,
    onChangeStarSpread,
    onChangeStarTotal,
    handleOddsChangeModalShow,
    handleOddsChangeModalHide,
    oddsChangeModalShow
  } = props

    const handleOnChangeGameScore = (event) => {
        onChangeGameScore(game.gameId, event)
    }
    
    const { results } = game
    const { odds } = prediction && prediction.odds ? prediction : game
    let awayTeamSpreadResult, homeTeamSpreadResult, totalResult;
    if (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) {
      awayTeamSpreadResult = (gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore) % 1 === 0 ? (gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore) : (gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore).toFixed(2)
      homeTeamSpreadResult = (gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore) % 1 === 0 ? (gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore) : (gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore).toFixed(2)
      totalResult = (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore) % 1 === 0 ? (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore) : (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore).toFixed(2)
    }
    // const gameCannotBeUpdated = gameCannotBeUpdated(date)
    if (!prediction && !gamePrediction && results) {
      return (<Row className="predictionRow noPrediction"><Col span={24}>No prediction submitted</Col></Row>)
    }
    return (
      <Row className={`${predictionType.type === 'crowd' && (`crowdRow`)} predictionRow`}>
        <Col span={24}>
          <Row>
            <Col span={4} className="team">
              <Text>{predictionType.title}</Text>
            </Col>
            <Col span={showPrediction ? 5 : 10}>{game.results ? prediction ? (
                <div style={{position: 'relative'}}>
                  {checkBullseye(prediction.awayTeam.score, results.awayTeam.score)}
                  {results && (prediction.awayTeam.score > prediction.homeTeam.score) ? straightUpResults(results, prediction) : null}
                  {prediction.awayTeam.score}
                </div>
                ) : '' : (
                <input style={{width: '100%'}} onChange={handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={(!prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionAwayTeamScore)) ? '##' : null}
                value={(gamePrediction && gamePrediction.predictionAwayTeamScore !== null) ? gamePrediction.predictionAwayTeamScore : prediction ? parseInt(prediction.awayTeam.score) : ''} />
              )}
            </Col>
            <Col span={showPrediction ? 5 : 10}>
              {game.results ? prediction ? (
                <div style={{position: 'relative'}}>
                  {checkBullseye(prediction.homeTeam.score, results.homeTeam.score)}
                  {(prediction.homeTeam.score > prediction.awayTeam.score) ? straightUpResults(results, prediction) : null}
                  {prediction.homeTeam.score}
                  </div>
                ) : '' : (
                <input style={{width: '100%'}} onChange={handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={(!prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionHomeTeamScore)) ? '##' : null}
                value={(gamePrediction && gamePrediction.predictionHomeTeamScore !== null) ? gamePrediction.predictionHomeTeamScore : 
                  prediction ? prediction.homeTeam.score : ''}  />
              )}
            </Col>
            {showPrediction ? (
            <Col span={5} className="odds">
              {(showPrediction && odds) ? (
                <div style={{position: 'relative'}}>
                  {results ? spreadResults(odds, results,prediction) : null}
                  
                  {results ? checkBullseye(prediction.spread, results.spread) : null}
                  {spreadPrediction(game, gamePrediction.predictionAwayTeamScore, gamePrediction.predictionHomeTeamScore)}<br/>
                  <span className="predictionSpread">(
                  {(gamePrediction.predictionHomeTeamScore + odds.spread) > gamePrediction.predictionAwayTeamScore // home team covers
                    ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                      ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                      : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                    : (gamePrediction.predictionHomeTeamScore + odds.spread) < gamePrediction.predictionAwayTeamScore 
                      ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                        ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                        : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                      : (gamePrediction.predictionHomeTeamScore + odds.spread) === gamePrediction.predictionAwayTeamScore
                        ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                          ? `${game.awayTeam.code} by ${awayTeamSpreadResult}`
                          : `${game.homeTeam.code} by ${homeTeamSpreadResult}`
                        : ''})</span>
                </div>) : ''}
              
              </Col>
              ) : null}
              {showPrediction ? (
              <Col span={5} className="odds">
                {(showPrediction && odds) ? (
                <div style={{position: 'relative'}}>
                  
                {results ? totalResults(odds, results,prediction) : null}
                {results ? checkBullseye(prediction.total, results.total) : null}
                {totalPrediction(game, gamePrediction.predictionAwayTeamScore, gamePrediction.predictionHomeTeamScore)} 
                <br/><span className="predictionSpread">({((prediction || (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore)) && odds) ? `${totalResult}` : ''})</span>
                </div>
              ) : ''}
              </Col>
              ) : null}
            </Row>
        {prediction && prediction.results ? (
          <Row className='predictionScoreBox'>
            <Col span={24}>
              Prediction Score: {prediction.predictionScore}
            </Col>
          </Row>
        ) : null}
        {predictionType.user && (<GamePreviewStakes game={game} gamePrediction={gamePrediction} />)}

        {prediction && prediction.odds && ((game.odds.spread !== game.prediction.odds.spread) || (game.odds.total !== game.prediction.odds.total)) ? (
          !game.results ? (
            <Row className="oddsChangeAlert alertText" onClick={() => handleOddsChangeModalShow()}>
              <Col span={24}>
                <Text warning>Alert - Odds have changed</Text>
                </Col>
            </Row>
          ) : (
            <Row className="oddsChangeAlert">
              <Col span={24}>
              Final Game Odds:<br/>
              Spread: {game.odds.spread} | Total: {game.odds.total}
              </Col>
            </Row>
          )
        ) : null}

        {prediction && prediction.odds && ((game.odds.spread !== game.prediction.spread) || (game.odds.total !== game.prediction.total)) ? (
          <OddsChangeModal oddsChangeModalShow={oddsChangeModalShow} handleOddsChangeModalShow={handleOddsChangeModalShow} handleOddsChangeModalHide={handleOddsChangeModalHide} game={game} prediction={prediction} />
        ) : null}
        </Col>
      </Row>
    )
}

export default GamePreviewPrediction

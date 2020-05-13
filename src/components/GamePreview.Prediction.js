import React from 'react'
import StarRatingComponent from 'react-star-rating-component'
import OddsChangeModal from './Game.OddsChangeModal';
import * as ResultsCheck from './GamePreview.ResultsCheck'

import { gameCannotBeUpdated, spreadPrediction, totalPrediction } from '../apis'

// import StakeIcon from '../images/stake-image.png'


const GamePreviewPrediction = ({ game, prediction, gamePrediction, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, handleOddsChangeModalShow, handleOddsChangeModalHide, oddsChangeModalShow }) => {
  
    const handleOnChangeStarSpread = (event) => {
        onChangeStarSpread(game.gameId, event)
    }

    const handleOnChangeStarTotal = (event) => {
        onChangeStarTotal(game.gameId, event)
    }

    const handleOnChangeGameScore = (event) => {
        onChangeGameScore(game.gameId, event)
    }
    
    const { results } = game
    const { odds } = prediction && prediction.odds ? prediction : game

    const date = new Date(game.startDateTime)
    if (!prediction && !gamePrediction && results) {
      return (<div>
        No prediction submitted
      </div>)
    }

    // console.log('prediction :', prediction);
    // console.log({awayTeamScoreOrZero: gamePrediction.predictionAwayTeamScore || gamePrediction.predictionAwayTeamScore === 0,
    // awayTeamScoreIsInt: parseInt(gamePrediction.predictionAwayTeamScore)});
    // return (<div></div>)
    return (

      <div>
        <div className="team">
          <div>{(prediction || !results) 
            ? prediction 
                ? !prediction.preferred_username || prediction.userId ? 'Me' : prediction.preferred_username
            : 'Me' : ''}
          </div>
          <div>{game.results ? prediction ? (
            <div style={{position: 'relative'}}>
              {ResultsCheck.checkBullseye(prediction.awayTeam.score, results.awayTeam.score)}
              {results && (prediction.awayTeam.score > prediction.homeTeam.score) ? ResultsCheck.straightUpResults(results, prediction) : null}
              {prediction.awayTeam.score}
            </div>
            ) : '' : (
            <input style={{width: '100%'}} onChange={handleOnChangeGameScore} name='predictionAwayTeamScore' placeholder={(!prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionAwayTeamScore)) ? '##' : null}
            value={(gamePrediction && gamePrediction.predictionAwayTeamScore !== null) ? gamePrediction.predictionAwayTeamScore : prediction ? parseInt(prediction.awayTeam.score) : ''} />
          )}
          </div>
          <div>{game.results ? prediction ? (
            <div style={{position: 'relative'}}>
              {ResultsCheck.checkBullseye(prediction.homeTeam.score, results.homeTeam.score)}
              {(prediction.homeTeam.score > prediction.awayTeam.score) ? ResultsCheck.straightUpResults(results, prediction) : null}
              {prediction.homeTeam.score}
              </div>
            ) : '' : (
            <input style={{width: '100%'}} onChange={handleOnChangeGameScore} name='predictionHomeTeamScore' placeholder={(!prediction && !gamePrediction && (gamePrediction && !gamePrediction.predictionHomeTeamScore)) ? '##' : null}
            value={(gamePrediction && gamePrediction.predictionHomeTeamScore !== null) ? gamePrediction.predictionHomeTeamScore : 
              prediction ? prediction.homeTeam.score : ''}  />
          )}
          </div>
          {((gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) || (game.prediction)) ? (
          <div className="odds">{((prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && odds) ? (
            <div style={{position: 'relative'}}>
              {results ? ResultsCheck.spreadResults(odds, results,prediction) : null}
              
              {results ? ResultsCheck.checkBullseye(prediction.spread, results.spread) : null}
              {spreadPrediction(game, parseInt(gamePrediction.predictionAwayTeamScore), parseInt(gamePrediction.predictionHomeTeamScore))}<br/>
              <span className="predictionSpread">(
              {(gamePrediction.predictionHomeTeamScore + odds.spread) > gamePrediction.predictionAwayTeamScore // home team covers
                ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                  ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                  : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                : (gamePrediction.predictionHomeTeamScore + odds.spread) < gamePrediction.predictionAwayTeamScore 
                  ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                    ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                    : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                  : (gamePrediction.predictionHomeTeamScore + odds.spread) === gamePrediction.predictionAwayTeamScore
                    ? gamePrediction.predictionAwayTeamScore > gamePrediction.predictionHomeTeamScore 
                      ? `${game.awayTeam.code} by ${gamePrediction.predictionAwayTeamScore - gamePrediction.predictionHomeTeamScore}`
                      : `${game.homeTeam.code} by ${gamePrediction.predictionHomeTeamScore - gamePrediction.predictionAwayTeamScore}`
                    : ''})</span>
            </div>) : ''}
          
          </div>
          ) : null}
          {((gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore) || (game.prediction)) ? (
          <div className="odds">{((prediction || (gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) && odds) ? (
            <div style={{position: 'relative'}}>
              
            {results ? ResultsCheck.totalResults(odds, results,prediction) : null}
            {results ? ResultsCheck.checkBullseye(prediction.total, results.total) : null}
            {totalPrediction(game, parseInt(gamePrediction.predictionAwayTeamScore), parseInt(gamePrediction.predictionHomeTeamScore))} 
            <br/><span className="predictionSpread">({((prediction || (gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore)) && odds) ? `${gamePrediction.predictionAwayTeamScore + gamePrediction.predictionHomeTeamScore}` : ''})</span>
            </div>
          ) : ''}
          </div>
          ) : null}
        </div>
        {prediction && prediction.results ? (
          <div className='predictionScoreBox'>
            Prediction Score: {prediction.predictionScore}
          </div>
        ) : null}
        {((prediction && prediction.awayTeam.score && prediction.homeTeam.score) || (gamePrediction && gamePrediction.predictionAwayTeamScore && gamePrediction.predictionHomeTeamScore)) ? (
        <div style={{display: 'flex', flexDirection: 'rew', justifyContent: 'space-evenly'}}>
          <div className='stars'>
            Spread: 
            {!results ? (
              <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsSpread_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsSpread_0" >
                  <i className="fa fa-minus-circle" aria-hidden="true" onClick={handleOnChangeStarTotal}></i>
                </label>
              </span>
            ) : null}
            <StarRatingComponent 
              name={'starsSpread'}
              editing={!results}
              // renderStarIcon={() => <img src={require('../images/stake-image.png').default} style={{width: 20, height: 20}} alt={`Stake Icon`} />}
              value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.spread : (prediction && prediction.stars) ? prediction.stars.spread : 0}
              starCount={3}
              starColor={(!results || (prediction && prediction.results && prediction.results.spread.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
              emptyStarColor={'#f6dfa4'}
              onStarClick={handleOnChangeStarSpread}
              />
          </div>
          <div className='stars'>
            Total: 
            {!results ? (
              <span>
                <input className="dv-star-rating-input" type="radio" name="starsSpread" id="starsTotal_0" value="0" style={{display: 'none', position: 'absolute', marginLeft: -9999}}></input>
                <label className="dv-star-rating-star dv-star-rating-empty-star dv-star-rating-null" htmlFor="starsTotal_0" >
                  <i className="fa fa-minus-circle" aria-hidden="true" onClick={handleOnChangeStarTotal}></i>
                </label>
              </span>
            ) : null}
            <StarRatingComponent 
              name='starsTotal'
              editing={!results}
              // renderStarIcon={() => <img src={require('../images/stake-image.png').default} alt="Stake" />}
              value={(gamePrediction && gamePrediction.stars) ? gamePrediction.stars.total : (prediction && prediction.stars) ? prediction.stars.total : 0}
              starCount={3}
              starColor={(!results || (prediction && prediction.results && prediction.results.total.correct === 1)) ? '#124734' : '#e04403'} /* color of selected icons, default `#ffb400` */
              emptyStarColor={'#f6dfa4'}
              onStarClick={handleOnChangeStarTotal}
              />
          </div>
        </div>
        ) : null}

        {prediction && prediction.odds && ((game.odds.spread !== game.prediction.odds.spread) || (game.odds.total !== game.prediction.odds.total)) ? (
          !game.results ? (
            <div className="oddsChangeAlert alertText" onClick={() => handleOddsChangeModalShow()}>
              Alert - Odds have changed
            </div>
          ) : (
            <div className="oddsChangeAlert">
              Final Game Odds:<br/>
              Spread: {game.odds.spread} | Total: {game.odds.total}
            </div>
          )
        ) : null}

        {prediction && prediction.odds && ((game.odds.spread !== game.prediction.spread) || (game.odds.total !== game.prediction.total)) ? (
          <OddsChangeModal oddsChangeModalShow={oddsChangeModalShow} handleOddsChangeModalShow={handleOddsChangeModalShow} handleOddsChangeModalHide={handleOddsChangeModalHide} game={game} prediction={prediction} />
        ) : null}
      </div>
    )
}

export default GamePreviewPrediction

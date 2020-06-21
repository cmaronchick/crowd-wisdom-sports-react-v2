import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamePreview from '../game/GamePreview';
import './GamesList.less'
import Weeks from '../weeks/Weeks'
import SeasonSelector from '../seasonSelector/SeasonSelector'

import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'

import { connect } from 'react-redux'

import { Spin } from 'antd'
import { antIcon } from '../../functions/utils'


const GamesList = (props) => {
  const { sport, games, predictions, loadingGames } = props
  console.log({ predictions });
  //{ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }
  let orderedGames = {}

  if (games && Object.keys(games).length === 0 && sport && sport.sport && !loadingGames) {
    const { year, season, week } = sport.gameWeekData
    props.fetchGameWeekGames(sport.sport, year, season, week)
  }
  return (
      <div className="gamesList">
        {loadingGames ? (
          <Spin indicator={antIcon} />
        ) : games && Object.keys(games).length > 0 ? (
        <Fragment>
          {Object.keys(games).sort((a,b) => {
            return (games[b].status === games[a].status) ? new Date(games[a].startDateTime) - new Date(games[b].startDateTime) : new Date(games[b].startDateTime) - new Date(games[a].startDateTime)
          }).map(gameId => {
            let predictionsArray = []
            if (predictions && Object.keys(predictions).length > 0) {
              Object.keys(predictions).map(predictionKey => {
                if (predictions[predictionKey][gameId]) {
                  predictionsArray.push({
                    type: predictionKey,
                    name: predictions[predictionKey].name,
                    ...predictions[predictionKey][gameId]
                  })
                }
              })
            }
            
            // if (gamePredictions[gameId]) {
            //   console.log(`gamePredictions[gameId]: ${JSON.stringify(gamePredictions[gameId])}`)
            // }

            //console.log({ gameId, game: games[gameId], gamePrediction: gamePredictions[gameId]})
            return <GamePreview
            key={gameId}
            onClick={props.fetchGame}
            // onChangeGameScore={onChangeGameScore}
            // onChangeStarSpread={onChangeStarSpread}
            // onChangeStarTotal={onChangeStarTotal}
            // onSubmitPrediction={onSubmitPrediction}
            game={games[gameId]}
            predictions={predictionsArray} />
          }
          )}

        </Fragment>
        ) : (
          <div>No games available</div>
        )}
      </div>
);
        }

GamesList.propTypes = {
  games: PropTypes.object.isRequired,
  predictions: PropTypes.array.isRequired,
  loadingGames: PropTypes.bool.isRequired,
  sport: PropTypes.object.isRequired,
  fetchGame: PropTypes.func,
  fetchGameWeekGames: PropTypes.func
};

const mapActionsToProps = {
  fetchGame,
  fetchGameWeekGames
}

export default connect(null, mapActionsToProps)(GamesList);
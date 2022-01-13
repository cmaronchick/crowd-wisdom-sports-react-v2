import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamePreview from '../game/GamePreview';
import './GamesList.less'

import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'
import { changeGameScore, submitPrediction } from '../../redux/actions/predictionsActions'
import { toggleOddsChangeModal } from '../../redux/actions/uiActions'

import { connect } from 'react-redux'

import { Spin } from 'antd'
import { antIcon } from '../../functions/utils'


const GamesList = (props) => {
  const { sport, predictions } = props
  const { games, loadingGames } = props.games
  //{ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }
  console.log(`games`, games)
  if (games && Object.keys(games).length === 0 && sport && sport.sport && loadingGames === null) {
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
                  return;
                }
              })
            }
            

            // predictions will be an array of predictions
            // in order to show more than one prediction
            // such as comparing my prediction to another users

            return <GamePreview
            user={props.user}
            key={gameId}
            headerRowArrowClick={() => props.fetchGame(games[gameId].sport, games[gameId].year, games[gameId].season, games[gameId].gameWeek, gameId)}
            handleChangeGameScore={props.changeGameScore}
            handleSubmitPrediction={props.submitPrediction}
            toggleOddsChangeModal={props.toggleOddsChangeModal}
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
  predictions: PropTypes.object.isRequired,
  sport: PropTypes.object.isRequired,
  fetchGame: PropTypes.func.isRequired,
  fetchGameWeekGames: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  sport: state.sport,
  games: state.games,
  predictions: state.predictions
})

const mapActionsToProps = {
  fetchGame,
  fetchGameWeekGames,
  changeGameScore,
  submitPrediction,
  toggleOddsChangeModal
}

export default connect(mapStateToProps, mapActionsToProps)(GamesList);
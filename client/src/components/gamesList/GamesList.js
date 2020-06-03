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
  const { sport, games, gamePredictions, loadingGames } = props
  //console.log({ games, gamePredictions });
  //{ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }
  let orderedGames = {}

  if (Object.keys(games).length === 0 && sport && sport.sport && !loadingGames) {
    const { year, season, week } = sport.gameWeekData
    props.fetchGameWeekGames(sport.sport, year, season, week)
  }

  return (
      <div className="gamesList">
        <div className="selectorHeader">
          <SeasonSelector />
          <Weeks onGameWeekClick={props.fetchGameWeekGames} page="games" />
        </div>
        {loadingGames ? (
          <Spin indicator={antIcon} />
        ) : games && Object.keys(games).length > 0 ? (
        <Fragment>
          {Object.keys(games).sort((a,b) => {
            return (games[b].status === games[a].status) ? new Date(games[a].startDateTime) - new Date(games[b].startDateTime) : new Date(games[b].startDateTime) - new Date(games[a].startDateTime)
          }).map(gameId => {
            //console.log({gameId});
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
            gamePrediction={gamePredictions[gameId]} />
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
  gamePredictions: PropTypes.object.isRequired,
  loadingGames: PropTypes.bool.isRequired,
  sport: PropTypes.object.isRequired,
  fetchGame: PropTypes.func.isRequired,
  fetchGameWeekGames: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loadingGames: state.games.loadingGames,
  games: state.games.games,
  gamePredictions: state.games.gamePredictions,
  sport: state.sport
})

const mapActionsToProps = {
  fetchGame,
  fetchGameWeekGames
}

export default connect(mapStateToProps, mapActionsToProps)(GamesList);
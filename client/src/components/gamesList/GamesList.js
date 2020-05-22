import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamePreview from '../game/GamePreview';
import './GamesList.css'

import { fetchGame } from '../../redux/actions/gamesActions'

import { connect } from 'react-redux'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const GamesList = (props) => {
  const { games, gamePredictions, loadingGames } = props
  //console.log({ games, gamePredictions });
  //{ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }
  let orderedGames = {}

  return games && Object.keys(games).length > 0 ? (
    <Fragment>
      <div className="gamesList">
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
      </div>
    </Fragment>
  ) : loadingGames ? (
    <Spin indicator={antIcon} />
  ) : (
    <div>No games available</div>
  )
};

GamesList.propTypes = {
  games: PropTypes.object.isRequired,
  gamePredictions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  loadingGames: state.games.loadingGames,
  games: state.games.games,
  gamePredictions: state.games.gamePredictions
})

const mapActionsToProps = {
  fetchGame
}

export default connect(mapStateToProps, mapActionsToProps)(GamesList);
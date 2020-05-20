import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'
import GamePreview from './GamePreview'
import GameOddsChart from './GameOddsChart'

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Game = (props) => {
    const { game, gamePredictions, loadingGame } = props;
    const gamePrediction = gamePredictions[game.gameId]
    const { sport, season, year, gameWeek } = game
    const handleGamesListClick = () => {
      props.fetchGameWeekGames(sport, season, year, gameWeek)
    }
    if (Object.keys(game).length === 0 && loadingGame) {
      console.log('game, loadingGame', game, loadingGame)
      return (
        <Spin indicator={antIcon} />
      )
    }
    return (
          <div className="Game">
            <Link
              className="home-link link"
              onClick={handleGamesListClick}
              to={`/${sport}/games/${year}/${season}/${gameWeek}`}>
              <i className="fas fa-arrow-left" style={{fontSize: '1.2em', fontWeight: 'bold' }}></i>
            </Link>
            <GamePreview
              // onChangeGameScore={this.props.onChangeGameScore}
              // onChangeStarSpread={this.props.onChangeStarSpread}
              // onChangeStarTotal={this.props.onChangeStarTotal}
              // onSubmitPrediction={this.props.onSubmitPrediction}
              // onClick={this.props.onGameClick}
              game={game} gamePrediction={gamePrediction} />
              {/* {game.odds && game.odds.history ? (
                <GameOddsChart ref={this.chartReference} game={game} />
              ) : null} */}

            <Link
              className="home-link link"
              onClick={handleGamesListClick}
              to={`/${sport}/games/${year}/${season}/${gameWeek}`}>
                Games List
            </Link>

          </div>
    );
}

Game.propTypes = {
  game: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  loadingGame: state.games.loadingGame,
  game: state.games.game,
  gamePredictions: state.games.gamePredictions,
  user: state.user
})

const mapActionsToProps = {
  fetchGameWeekGames,
  fetchGame
}

export default connect(mapStateToProps, mapActionsToProps)(Game);
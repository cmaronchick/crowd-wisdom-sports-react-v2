import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

// Redux Stuff
import { connect } from 'react-redux'
import { fetchGame, fetchGameWeekGames, toggleOddsChartType } from '../../redux/actions/gamesActions'
import GamePreview from './GamePreview'
import GameOddsChart from './GameOddsChart'

import { Spin, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const antIcon = <LoadingOutlined title="Loading Game" alt="Loading Game" style={{ fontSize: 24 }} spin />;

const Game = (props) => {
    const { game, gamePredictions, loadingGame, match } = props;
    const urlParams = {...match.params}
    urlParams.gameId = parseInt(urlParams.gameId);
    const gamePrediction = gamePredictions[game.gameId]
    const { sport, year, season, gameWeek } = game
    const handleGamesListClick = () => {
      props.fetchGameWeekGames(sport, year, season, gameWeek)
    }
    if (game.gameId && urlParams.gameId && game.gameId !== urlParams.gameId && !loadingGame) {
      props.fetchGame(sport ? sport : urlParams.sport, year ? year : parseInt(urlParams.year), season ? season : urlParams.season, gameWeek ? gameWeek : parseInt(urlParams.gameWeek), urlParams.gameId)
    }
    console.log('loadingGame', loadingGame)
    if (Object.keys(game).length === 0 && loadingGame) {
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
              {/* <i className="fas fa-arrow-left" style={{fontSize: '1.2em', fontWeight: 'bold' }}></i> */}
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <GamePreview
              // onChangeGameScore={this.props.onChangeGameScore}
              // onChangeStarSpread={this.props.onChangeStarSpread}
              // onChangeStarTotal={this.props.onChangeStarTotal}
              // onSubmitPrediction={this.props.onSubmitPrediction}
              // onClick={this.props.onGameClick}
              game={game} gamePrediction={gamePrediction}
              onClick={props.fetchGame}
              user={props.user}
              />
              {/* {game.odds && game.odds.history ? (
                <GameOddsChart ref={this.chartReference} game={game} />
              ) : null} */}
            {game && game.odds && (
              <div className="chartContainer">
                <Button type="primary" onClick={() => props.toggleOddsChartType()}>
                  Show {game.oddsChartType === 'spread' ? 'Spread' : 'Total'} Odds History</Button>
                <GameOddsChart game={game} />
              </div>
            )}
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
  fetchGame,
  toggleOddsChartType
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Game));
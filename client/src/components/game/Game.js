import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

// Redux Stuff
import { connect } from 'react-redux'
import { fetchGame, fetchGameWeekGames, toggleOddsChartType } from '../../redux/actions/gamesActions'
import { submitPrediction, changeGameScore, changeStakesValue } from '../../redux/actions/predictionsActions'
import { toggleOddsChangeModal } from '../../redux/actions/uiActions'
import GamePreview from './GamePreview'
import GameOddsChart from './GameOddsChart'

import { Spin, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined title="Loading Game" alt="Loading Game" style={{ fontSize: 24 }} spin />;

const Game = (props) => {
    const { game, predictions, loadingGame, match } = props;
    const urlParams = {...match.params}
    urlParams.gameId = parseInt(urlParams.gameId);
    const prediction = predictions?.user && Object.keys(predictions.user).length > 0 ? predictions.user[game.gameId] : game.prediction ? game.prediction : null
    const { sport, year, season, gameWeek } = game
    const handleGamesListClick = () => {
      props.fetchGameWeekGames(sport, year, season, gameWeek)
    }
    if (game.gameId && urlParams.gameId && game.gameId !== urlParams.gameId && !loadingGame) {
      props.fetchGame(sport ? sport : urlParams.sport, year ? year : parseInt(urlParams.year), season ? season : urlParams.season, gameWeek ? gameWeek : parseInt(urlParams.gameWeek), urlParams.gameId)
    }

    if (Object.keys(game).length === 0 && loadingGame) {
      return (
        <Spin indicator={antIcon} />
      )
    }
    return (
          <div className="Game">
            <GamePreview
              // onChangeGameScore={this.props.onChangeGameScore}
              // onChangeStarSpread={this.props.onChangeStarSpread}
              // onChangeStarTotal={this.props.onChangeStarTotal}
              // onSubmitPrediction={this.props.onSubmitPrediction}
              // onClick={this.props.onGameClick}
              game={game} 
              predictions={[{ type: 'user', ...prediction}]}
              onClick={props.fetchGame}
              user={props.user}
              handleSubmitPrediction={props.submitPrediction}
              handleChangeGameScore={props.changeGameScore}
              toggleOddsChangeModal={props.toggleOddsChangeModal}
              />
              {/* {game.odds && game.odds.history ? (
                <GameOddsChart ref={this.chartReference} game={game} />
              ) : null} */}
            {game && game.odds && (
              <div className="chartContainer">
                <Button type="primary" onClick={() => props.toggleOddsChartType()}>
                  Show {game.oddsChartType === 'total' || !game.oddsChartType ? 'Spread' : 'Total'} Odds History</Button>
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
  game: PropTypes.object.isRequired,
  submitPrediction: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  loadingGame: state.games.loadingGame,
  game: state.games.game,
  predictions: state.predictions,
  user: state.user
})

const mapActionsToProps = {
  fetchGameWeekGames,
  fetchGame,
  toggleOddsChartType,
  toggleOddsChangeModal,
  submitPrediction,
  changeGameScore,
  changeStakesValue
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Game));
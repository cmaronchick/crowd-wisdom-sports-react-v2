import React, { useState } from 'react';
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
    const [chartType, setChartType] = useState('spread')
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
              headerRowArrowClick={props.fetchGameWeekGames}
              handleChangeGameScore={props.changeGameScore}
              handleSubmitPrediction={props.submitPrediction}
              user={props.user}
              toggleOddsChangeModal={props.toggleOddsChangeModal}
              />
              {/* {game.odds && game.odds.history ? (
                <GameOddsChart ref={this.chartReference} game={game} />
              ) : null} */}
            {game && game.odds && (
              <div className="chartContainer">
                <div className="chartButton">
                  <Button type="primary" onClick={() => setChartType(chartType === 'spread' ? 'total' : 'spread')}>
                    Show {chartType === 'total' || chartType === 'totalOdds' ? 'Spread' : 'Total'} Odds History</Button>
                </div>
                <div className="chartButton">
                  <Button type="primary" onClick={() => setChartType(chartType === 'spread' || chartType === 'spreadOdds' ? (chartType === 'spreadOdds' ? 'spread' : 'spreadOdds') : (chartType === 'totalOdds' ? 'total' : 'totalOdds'))}>
                    Show {chartType === 'spread' || chartType === 'spreadOdds' ? 'Spread' : 'Total'} {chartType.indexOf('Odds') > -1 ? 'Odds' : 'Moneyline'} History</Button>
                </div>
                <GameOddsChart game={game} chartType={chartType} />
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
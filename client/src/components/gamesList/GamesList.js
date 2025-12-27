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

import FeaturedGame from './FeaturedGame';
import MatchupTicker from './MatchupTicker';

const statusPriority = {
  "inProgress": 1,
  "scheduled": 2,
  "final": 3
}

const GamesList = (props) => {
  const { sport, predictions } = props
  const { games, loadingGames } = props.games
  const [activeGameId, setActiveGameId] = React.useState(null);

  // Ref for observer
  const observerRef = React.useRef(null);
  const gameRefs = React.useRef({});

  React.useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) observerRef.current.disconnect();

    const options = {
      root: null, // viewport
      rootMargin: '-20% 0px -60% 0px', // Active when in top part of middle screen
      threshold: 0
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveGameId(entry.target.getAttribute('data-game-id'));
        }
      });
    }, options);

    // Observe all game elements
    Object.values(gameRefs.current).forEach(el => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    }
  }, [games, loadingGames]); // Re-run when games list updates

  const handleMatchupClick = (gameId) => {
    const element = document.getElementById(`game-${gameId}`);
    if (element) {          // Adjust for ticker height (approx 60-70px) and some padding
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };


  //{ games, gamePredictions, onGameClick, onChangeGameScore, onChangeStarSpread, onChangeStarTotal, onSubmitPrediction }
  // console.log(`games`, games)
  if (games && Object.keys(games).length === 0 && sport && sport.sport && loadingGames === null) {
    const { year, season, week } = sport.gameWeekData
    props.fetchGameWeekGames(sport.sport, year, season, week)
  }

  // Generate sorted games list once
  let sortedGames = [];
  let featuredGameId = null;

  if (games && Object.keys(games).length > 0) {
    const sortedGameIds = Object.keys(games).sort((a, b) => {
      return (games[b].status === games[a].status) ? new Date(games[a].startDateTime) - new Date(games[b].startDateTime) : statusPriority[games[a].status] - statusPriority[games[b].status]
    });
    sortedGames = sortedGameIds.map(id => games[id]);

    // Find a feature game (first scheduled or inProgress game)
    featuredGameId = sortedGameIds.find(id => games[id].status === 'scheduled' || games[id].status === 'inProgress');
    // If no active games, just take the first one
    if (!featuredGameId && sortedGameIds.length > 0) {
      featuredGameId = sortedGameIds[0];
    }
  }

  return (
    <div className="gamesList">
      {loadingGames ? (
        <Spin indicator={antIcon} />
      ) : games && Object.keys(games).length > 0 ? (
        <Fragment>
          <MatchupTicker games={sortedGames} activeGameId={activeGameId} onMatchupClick={handleMatchupClick} />

          {featuredGameId && (
            <div id={`game-${featuredGameId}`} data-game-id={featuredGameId} ref={el => gameRefs.current[featuredGameId] = el}>
              <FeaturedGame
                game={games[featuredGameId]}
                user={props.user}
                prediction={predictions && predictions["user"][featuredGameId] ? predictions["user"][featuredGameId] : null}
                handleOnChangeGameScore={props.changeGameScore}
                handleSubmitPrediction={props.submitPrediction}
                onGameClick={(gameId) => props.fetchGame(games[gameId].sport, games[gameId].year, games[gameId].season, games[gameId].gameWeek, gameId)}
              />
            </div>
          )}

          {sortedGames.map(game => {
            const gameId = game.gameId;
            if (gameId == featuredGameId) return null; // Deduplicate

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

            return featuredGameId !== gameId && (
              <div key={gameId} id={`game-${gameId}`} data-game-id={gameId} ref={el => gameRefs.current[gameId] = el}>
                <GamePreview
                  user={props.user}
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
              </div>
            )
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
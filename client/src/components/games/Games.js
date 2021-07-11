import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamesList from '../gamesList/GamesList'
import Weeks from '../weeks/Weeks'
import SeasonSelector from '../seasonSelector/SeasonSelector'
import Stats from '../home/Stats'
import ContestBanner from '../../components/game/ContestBanner'

import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'
import { toggleHowToPlayModal } from '../../redux/actions/uiActions'

import { connect } from 'react-redux'

const Games = (props) => {

    return (
        <Fragment>
        <ContestBanner howToPlayModalOpen={props.UI.howToPlayModalOpen} toggleHowToPlayModal={props.toggleHowToPlayModal} />
        <div className="gamesContainer">
            <div className="selectorHeader">
                <SeasonSelector
                    sport={props.sport.sport} season={props.sport.gameWeekData.season}
                />
                <Weeks onGameWeekClick={props.fetchGameWeekGames} page="games" />
            </div>
            {/* {(props.leaderboards && props.leaderboards.crowd && (props.leaderboards.crowd.weekly || props.leaderboards?.crowd?.overall)) && (
                <Stats selectedWeek={props.sport.gameWeekData.week} crowdResults={props.leaderboards.crowd}/>
            )} */}
            <GamesList
                games={props.games}
                predictions={{user: props.predictions.user}}
                loadingGames={props.loadingGames}
                sport={props.sport}
                fetchGame={props.fetchGame}
                fetchGameWeekGames={props.fetchGameWeekGames}
                user={props.user}
                compareTo={props.compareUser ? props.compareUser : `Crowd`}
                UI={props.UI}
                />
        </div>
        </Fragment>
    )
}


GamesList.propTypes = {
    games: PropTypes.object.isRequired,
    predictions: PropTypes.object.isRequired,
    loadingGames: PropTypes.bool.isRequired,
    sport: PropTypes.object.isRequired,
    user: PropTypes.object,
    fetchGame: PropTypes.func.isRequired,
    fetchGameWeekGames: PropTypes.func.isRequired
  };


const mapStateToProps = (state) => ({
    sport: state.sport,
    games: state.games.games,
    predictions: state.predictions,
    loadingGames: state.games.loadingGames,
    leaderboards: state.leaderboards,
    user: state.user,
    UI: state.UI
})
const mapActionsToProps = {
    fetchGame,
    fetchGameWeekGames,
    toggleHowToPlayModal
}

export default connect(mapStateToProps, mapActionsToProps)(Games)
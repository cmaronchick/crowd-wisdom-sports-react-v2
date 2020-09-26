import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamesList from '../gamesList/GamesList'
import Weeks from '../weeks/Weeks'

import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'

import { connect } from 'react-redux'

const Games = (props) => {

    return (
        <Fragment>
        <div className="selectorHeader">
            {/* <SeasonSelector /> */}
            <Weeks onGameWeekClick={props.fetchGameWeekGames} page="games" />
        </div>
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
    user: state.user,
    UI: state.UI
})
const mapActionsToProps = {
    fetchGame,
    fetchGameWeekGames
}

export default connect(mapStateToProps, mapActionsToProps)(Games)
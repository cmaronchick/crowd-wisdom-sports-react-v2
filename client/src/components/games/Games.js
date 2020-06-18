import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import GamePreview from '../game/GamePreview';
import GamesList from '../gamesList/GamesList'
import Weeks from '../weeks/Weeks'
import SeasonSelector from '../seasonSelector/SeasonSelector'

import { fetchGame, fetchGameWeekGames } from '../../redux/actions/gamesActions'

import { connect } from 'react-redux'

const Games = (props) => {

    return (
        <Fragment>
        <div className="selectorHeader">
            <SeasonSelector />
            <Weeks onGameWeekClick={props.fetchGameWeekGames} page="games" />
        </div>
        <GamesList
            games={props.games}
            gamePredictions={props.gamePredictions}
            loadingGames={props.loadingGames}
            sport={props.sport}
            fetchGame={props.fetchGame}
            fetchGameWeekGames={props.fetchGameWeekGames}
            user={props.user}
            compareTo={props.compareUser ? props.compareUser : `Crowd`}
            />
        </Fragment>
    )
}


GamesList.propTypes = {
    games: PropTypes.object.isRequired,
    gamePredictions: PropTypes.object.isRequired,
    loadingGames: PropTypes.bool.isRequired,
    sport: PropTypes.object.isRequired,
    user: PropTypes.object,
    fetchGame: PropTypes.func.isRequired,
    fetchGameWeekGames: PropTypes.func.isRequired
  };


const mapStateToProps = (state) => ({
    games: state.games.games,
    gamePredictions: state.games.gamePredictions,
    loadingGames: state.games.loadingGames,
    user: state.user
})
const mapActionsToProps = {
    fetchGame,
    fetchGameWeekGames
}

export default connect(mapStateToProps, mapActionsToProps)(Games)
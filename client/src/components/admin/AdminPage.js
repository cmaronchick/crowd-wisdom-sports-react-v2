import React, { useEffect, useState} from 'react'
import { Card, Button, Spinner, Row, Col, Typography } from 'antd'

import { connect } from 'react-redux'

import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

import { fetchGameWeekGames } from '../../redux/actions/gamesActions'

const AdminPage = (props) => {
    const { sport, games, user, fetchGameWeekGames} = props
    const [games, setGames] = useState({})

    useEffect(() => {
        
    })

    console.log('admin page')
    return (
        
        <div className="gamesContainer">
            <div className="selectorHeader">
                <SeasonSelector
                    sport={sport.sport} season={sport.gameWeekData.season}
                />
                <Weeks onGameWeekClick={fetchGameWeekGames} page="games" />
            </div>
            {games && Object.keys(games.games).length > 0 && Object.keys(games.games).map(gameId => {
                const { awayTeam, homeTeam, odds } = games.games[gameId]
                return (
                <Card key={gameId}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <div>{awayTeam.code}<input type="number" id="awayTeamScore" /></div> at <div>{homeTeam.code}<input type="number" id="homeTeamScore" /></div>
                    </div>
                </Card>
                )}
            )}
            
        </div>
    )
}

const mapStateToProps = (state) => ({
    sport: state.sport,
    games: state.games,
    user: state.user
})

const mapDispatchToProps = {
    fetchGameWeekGames

}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)
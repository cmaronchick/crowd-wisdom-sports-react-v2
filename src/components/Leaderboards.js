import React, { Component } from 'react'
import Auth from '@aws-amplify/auth'
import * as api from '../api'

export default class Leaderboards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaderboardData: this.props.leaderboardData,
            _isMounted: false
        }
    }

    getLeaderboard = async (sport, year, season, gameWeek) => {
        console.log('this.state._isMounted: ', this.state._isMounted)
        if (this.state._isMounted) { 
            try {
                let userSession = await Auth.currentSession()
                let leaderboardData = await api.fetchOverallLeaderboard(userSession, sport, year, season, gameWeek)
                this.state._isMounted ? this.setState({leaderboardData}) : null
                
            } catch(leaderboardDataError) {
                console.error('leaderboardDataError: ', leaderboardDataError)
            }
        }
    }


    componentDidMount() {
        //this.getLeaderboard('nfl', 2018, 'post', 21)
    }
    componentDidUpdate(prevProps, prevState) {
        
    }

    componentWillUnmount() {
        
    }

    render() {
        const { leaderboardData } = this.state
        console.log('Leaderboards leaderboardData: ', JSON.stringify(leaderboardData))
        return (
            <div>
                {leaderboardData ? 
                    leaderboardData.leaderboardData.map((user, index) => {
                        return (
                            <div key={index}>
                                {user.preferred_username} {user.results.overall.predictionScore}
                            </div>
                        ) 
                    })
                 : (
                    <div>No Leaderboard Data received</div>
                )}
            </div>
        )
    }
}

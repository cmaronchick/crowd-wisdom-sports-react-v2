import React, { Component } from 'react'
import Auth from '@aws-amplify/auth'
import * as api from '../api'


export default class HomeLeaderboards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overallLeaderboardData: null,
            weeklyLeaderboardData: null,
            sport: this.props.sport,
            year: this.props.year,
            week: this.props.week,
            season: this.props.season,
            user: this.props.user,
        }
    }
    _isMounted = true;

    async componentDidMount() {
        let user;
        try {
            user = await Auth.currentAuthenticatedUser()
        } catch (getAuthenticatedUserError) {
            user = null; 
        }
        
        const { sport, year, season, week, } = this.state;
        try {
            let userSession = await api.getUserSessionAsync()
            //console.log({ user ? user, sport, year, season, week })
            let overallLeaderboardData = await api.fetchOverallLeaderboard(userSession ? userSession : null, sport, year, season, week);
            let weeklyLeaderboardData = await api.fetchWeeklyLeaderboard(userSession ? userSession : null, sport, year, season, week)
            console.log({ overallLeaderboardData, weeklyLeaderboardData })
            if (this._isMounted) {
                this.setState({
                    overallLeaderboardData, weeklyLeaderboardData
                })
            }


        } catch (fetchLeaderboardDataError) {
            console.log({ fetchLeaderboardDataError });
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { overallLeaderboardData, weeklyLeaderboardData } = this.state;
        const overallLeaderboard = overallLeaderboardData && overallLeaderboardData.leaderboardData ? overallLeaderboardData.leaderboardData : null,
            weeklyLeaderboard = weeklyLeaderboardData && weeklyLeaderboardData.leaderboardData ? weeklyLeaderboardData.leaderboardData : null
        //console.log({ HomeLeaderboardState: this.state })
        return (
            <div className="homeLeaderboards">
                {overallLeaderboard ? (
                    
                    <table className="rwd-table">
                    <thead>
                        <tr>
                            <th className="rank"><span className="full abbrev">Rank</span></th>
                            <th className="entryowner"><span className="full">Username</span></th>
                            <th className="Record"><span className="full">Record</span></th>
                            <th className="total"><span className="full">Score</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {overallLeaderboard.overall.users.map((user, index) => {
                            let userCorrect = user.winner.correct + user.spread.correct + user.total.correct;
                            let userIncorrect = ((user.totalPredictions * 3) - (user.spread.push + user.total.push)) - userCorrect;
                            return (
                                <tr key={index} className={((index%2) === 0) ? ' alt-tr' : null}>
                                <td data-th="Rank">{index + 1}</td>
                                <td data-th="Username">{user.preferred_username}</td>
                                <td data-th="Record">{userCorrect}-{userIncorrect}</td>
                                <td data-th="Score">{user.predictionScore}
                                    <div className='leaderboard userScoreDetails'>
                                        S/U: {user.winner.correct}<br/>
                                        ATS: {user.spread.correct}<br/>
                                        O/U: {user.total.correct}
                                    </div></td>
                                </tr>
                            )
                        })}
                        
                    </tbody>
                    </table>
                ) : (
                    <div>Loading Overall Leaderboards</div>
                )}
            </div>

        )
    }
}

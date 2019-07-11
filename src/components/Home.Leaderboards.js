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
            //console.log({ user ? user, sport, year, season, week })
            let overallLeaderboardData = await api.fetchOverallLeaderboard(user ? user.currentSession() : null, 'nfl', 2018, 'reg', 1);
            let weeklyLeaderboardData = await api.fetchWeeklyLeaderboard(user ? user.currentSession() : null, sport, year, season, week)
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
        //console.log({ HomeLeaderboardState: this.state })
        return (
            <div className="homeLeaderboards">
                {overallLeaderboardData ? (
                    
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
                        {overallLeaderboardData.leaderboardData.map((user, index) => {
                            let results = user.results.overall;
                            let userCorrect = results.winner.correct + results.spread.correct + results.total.correct;
                            let userIncorrect = ((results.totalPredictions * 3) - (results.spread.push + results.total.push)) - userCorrect;
                            return (
                                <tr key={index} className={((index%2) === 0) ? ' alt-tr' : null}>
                                <td data-th="Rank">{index + 1}</td>
                                <td data-th="Username">{user.preferred_username}</td>
                                <td data-th="Record">{userCorrect}-{userIncorrect}</td>
                                <td data-th="Score">{results.predictionScore}
                                    <div className='leaderboard userScoreDetails'>
                                        S/U: {results.winner.correct}<br/>
                                        ATS: {results.spread.correct}<br/>
                                        O/U: {results.total.correct}
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

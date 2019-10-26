import React, { Component } from 'react'
import Auth from '@aws-amplify/auth'
import Button from 'react-bootstrap/Button'
import * as api from '../api'


const HomeLeaderboards = (props) => {
    const { overallLeaderboardData, weeklyLeaderboardData, fetchingLeaderboards, selectedLeaderboard,
        sport,
        year,
        week,
        season,
        handleSwitchLeaderboard
        } = props;
        
    const overallLeaderboard = overallLeaderboardData && overallLeaderboardData.leaderboardData ? overallLeaderboardData.leaderboardData : null,
        weeklyLeaderboard = weeklyLeaderboardData && weeklyLeaderboardData.leaderboardData ? weeklyLeaderboardData.leaderboardData : null
    if (!overallLeaderboard) return (
        <div>Loading Overall Leaderboards</div>
    )
    let leaderboardUsers = selectedLeaderboard === "weekly" ? overallLeaderboard.weekly.users : overallLeaderboard.overall.users
    console.log({leaderboardUsers});
    return (
            leaderboardUsers ? (
                <div className="homeLeaderboards">
                    <Button onClick={() => handleSwitchLeaderboard(selectedLeaderboard === "weekly" ? 'overall' : 'weekly')}>
                        Show {selectedLeaderboard === "weekly" ? "Overall" : "Weekly"} Leaderboard
                    </Button>
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
                        {leaderboardUsers.map((user, index) => {
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
                </div>
            ) : (
                <div>Loading Overall Leaderboards</div>
            )


    )
}

export default HomeLeaderboards

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Auth from '@aws-amplify/auth'
import { Button } from 'antd'
import * as api from '../apis'


const HomeLeaderboards = ({ overallLeaderboardData, 
    weeklyLeaderboardData,
    fetchingLeaderboards,
    selectedLeaderboard,
    sport,
    year,
    week,
    season,
    handleSwitchLeaderboard,
    handleOnUserClick
    }) => {
    // const { overallLeaderboardData, weeklyLeaderboardData, fetchingLeaderboards, selectedLeaderboard,
    //     sport,
    //     year,
    //     week,
    //     season,
    //     handleSwitchLeaderboard
    //     } = props;
        
    const overallLeaderboard = overallLeaderboardData ? overallLeaderboardData : null,
        weeklyLeaderboard = weeklyLeaderboardData ? weeklyLeaderboardData : null
    if (!overallLeaderboard) return (
        <div>Loading Leaderboard</div>
    )
    let leaderboardUsers = selectedLeaderboard === "overall" ? overallLeaderboard.overall.users : overallLeaderboard.weekly.users
    
    const onUserClick = (compareUsername) => {
        handleOnUserClick(sport, year, season, week, compareUsername)
    }

    return (
            leaderboardUsers ? (
                <div className="homeLeaderboards">
                    <Button onClick={() => handleSwitchLeaderboard(selectedLeaderboard === "overall" ? 'weekly' : 'overall')}>
                        Show {selectedLeaderboard === "overall" ? "Weekly" : "Overall"} Leaderboard
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
                                <td data-th="Username"><Link onClick={() => onUserClick(user.preferred_username) } to={`/${sport}/games/${year}/${season}/${week}?compareUsername=${user.preferred_username}`}>{user.preferred_username}</Link></td>
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

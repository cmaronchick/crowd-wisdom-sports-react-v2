import React, { Component } from 'react'

const Leaderboards = ({leaderboardDataObj, selectedLeaderboard}) => {
    
    if (!leaderboardDataObj) { 
        console.log('No leaderboard object')
        return (
            <div>No leaderboard found</div>
        )
    }
    console.log('leaderboardDataObj', leaderboardDataObj.leaderboardData)
    const leaderboard = selectedLeaderboard ? selectedLeaderboard : 'overall'
    const { gameWeek, season, sport, year, weekly, overall } = leaderboardDataObj.leaderboardData
    if (!weekly || !overall) {
        return null
    }
    const leaderboardArray = leaderboard === 'weekly' ? weekly : overall
    console.log({leaderboard, leaderboardArray})
    return (
        <div>
            {leaderboardArray ? 
                leaderboardArray.users.map((user, index) => {
                    console.log('user', user)
                    return (
                        <div key={index}>
                            {user.preferred_username} {user.predictionScore}
                        </div>
                    ) 
                })
                : (
                <div>No Leaderboard Data received</div>
            )}
        </div>
    )
}

export default Leaderboards
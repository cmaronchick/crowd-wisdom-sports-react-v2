import React, { Component } from 'react'
import PropTypes from 'prop-types'

const CrowdOverallCompare = ({ crowd, userStats, selectedLeaderboard }) => {
    
    const userResults = userStats && userStats.results ? selectedLeaderboard === 'overall' ? userStats.results.overall : userStats.results.weekly : null
    const crowdResults = crowd ? selectedLeaderboard === 'overall' ? crowd.overallRecord : crowd.weeklyRecord : null
        return crowd ? (
            <div className="crowdOverallCompare">
            <div className="compareRow userStats">
                <div></div>
                <div>Wins</div>
                <div>ATS</div>
                <div>O/U</div>
                <div>Score</div>
            </div>
                {(userResults && userResults.winner) ? (
                <div className="compareRow userStats">
                    <div>Me</div>
                    <div>{userResults.winner.correct}</div>
                    <div>{userResults.spread.correct}</div>
                    <div>{userResults.total.correct}</div>
                    <div>{userResults.predictionScore}</div>
                </div>
                ) : null}
                {crowdResults && crowdResults.winner ? 
                    (
                    <div className="compareRow crowdStats">
                        <div>Crowd</div>
                        <div>{crowdResults.winner.correct}</div>
                        <div>{crowdResults.spread.correct}</div>
                        <div>{crowdResults.total.correct}</div>
                        <div>{crowdResults.predictionScore}</div>
                    </div>
                ) : null}

            </div>
        ) : (
            <div>Loading Crowd Results ...</div>
        )
}

export default CrowdOverallCompare;

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const CrowdOverallCompare = ({ crowd, userStats }) => {
    
    console.log({crowd});
        return crowd ? (
            <div className="crowdOverallCompare">
            <div className="compareRow userStats">
                <div></div>
                <div>Wins</div>
                <div>ATS</div>
                <div>O/U</div>
                <div>Score</div>
            </div>
                {(userStats && userStats.results && userStats.results.weekly && userStats.results.weekly.spread) ? (
                <div className="compareRow userStats">
                    <div>Me</div>
                    <div>{userStats.results.weekly.winner.correct}</div>
                    <div>{userStats.results.weekly.spread.correct}</div>
                    <div>{userStats.results.weekly.total.correct}</div>
                    <div>{userStats.results.weekly.predictionScore}</div>
                </div>
                ) : null}
                {crowd && crowd.weeklyRecord && crowd.weeklyRecord.winner ? 
                    (
                    <div className="compareRow crowdStats">
                        <div>Crowd</div>
                        <div>{crowd.weeklyRecord.winner.correct}</div>
                        <div>{crowd.weeklyRecord.spread.correct}</div>
                        <div>{crowd.weeklyRecord.total.correct}</div>
                        <div>{crowd.weeklyRecord.predictionScore}</div>
                    </div>
                ) : null}

            </div>
        ) : (
            <div>Loading Crowd Results ...</div>
        )
}

export default CrowdOverallCompare;

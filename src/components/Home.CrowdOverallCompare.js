import React, { Component } from 'react'
import PropTypes from 'prop-types'

const CrowdOverallCompare = (props) => {
    console.log({CrowdOverallCompare: props})
    const crowd = props.crowd
    const userStats = props.userStats
        return (
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
                {crowd ? 
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
        )
}

export default CrowdOverallCompare;

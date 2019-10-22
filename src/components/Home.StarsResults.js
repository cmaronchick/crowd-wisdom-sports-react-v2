import React, { Component } from 'react'
import PropTypes from 'prop-types'

const HomeStarResults = ({ userStats }) => {
        return (
            <div className="crowdOverallCompare">
            <div className="compareRow userStats">
                <div></div>
                <div>Wagered</div>
                <div>Net</div>
                <div>ROI</div>
            </div>
                {(userStats && userStats.results && userStats.results.weekly && userStats.results.weekly.spread) ? (
                <div className="compareRow userStats">
                    <div>Me</div>
                    <div>{userStats.results.weekly.stars.wagered}</div>
                    <div>{userStats.results.weekly.stars.net}</div>
                    <div>{`${(userStats.results.weekly.stars.roi.toFixed(2) * 100)}%`}</div>
                </div>
                ) : null}
            </div>
        )
}

export default HomeStarResults;

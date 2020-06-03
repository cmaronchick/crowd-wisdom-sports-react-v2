import React, { Fragment } from 'react'

import { Tabs, Table, Spin } from 'antd'
import { antIcon } from '../../functions/utils'

import { connect } from 'react-redux'
import { fetchLeaderboards } from '../../redux/actions/leaderboardActions'
import './Leaderboards.less'

import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

const { TabPane } = Tabs

const Leaderboards = (props) => {
    const { leaderboards, loadingLeaderboards, user } = props
    const { sport, year, season, week } = props.sport.gameWeekData
    // console.log('sport, year, season, week', sport, year, season, week)
    console.log('leaderboards', leaderboards)
    const { weekly, overall } = leaderboards.leaderboards
    if ((!weekly || !overall) && !loadingLeaderboards && sport && year && season && week) {
        props.fetchLeaderboards(sport, year, season, week)
    }
    const leaderboardArray = weekly
    console.log({leaderboardArray})
    const columns = [
        {
            title: 'User',
            dataIndex: 'preferred_username',
            key: 'username'
        },
        {
            title: 'Prediction Score',
            dataIndex: 'predictionScore'
        },
        {
            title: 'Winners',
            dataIndex: 'winner',
            render: (winner) => (
                <span>
                    {winner.correct}
                </span>
            )
        },
        {
            title: 'Spread',
            dataIndex: 'spread',
            render: (spread) => (
                <span>
                    {spread.correct}
                </span>
            )
        },
        {
            title: 'Total',
            dataIndex: 'total',
            render: (total) => (
                <span>
                    {total.correct}
                </span>
            )
        }

    ]
    return (
        <div className="leaderboardContainer">
            <div className="selectorHeader">
                <SeasonSelector />
                <Weeks loading={loadingLeaderboards} onGameWeekClick={props.fetchLeaderboards} page="leaderboards" />
            </div>
            {!loadingLeaderboards ? (
                <Tabs>
                    <TabPane tab="Weekly" key="1">
                        {weekly && weekly.users ? (
                            <Table rowKey="username" dataSource={weekly.users.sort((a,b) => a.predictionScore > b.predictionScore ? -1 : 1)} columns={columns} />
                        ) : (
                            <div>No Weekly Leaderboard</div>
                        )}
                    </TabPane>
                    <TabPane tab="Overall" key="2">
                        {overall && overall.users ? (
                            <Table rowKey="username" dataSource={overall.users.sort((a,b) => a.predictionScore > b.predictionScore ? -1 : 1)} columns={columns} />
                        ) : (
                            <div>No Overall Leaderboard</div>
                        )}
                    </TabPane>
                </Tabs>
            ) : (
                <Spin className="loadingIndicator" indicator={antIcon} />
            )}
        </div>
    )
}

const mapStateToProps = (state) => ({
    leaderboards: state.leaderboards,
    loadingLeaderboards: state.leaderboards.loadingLeaderboards,
    user: state.user,
    sport: state.sport
})

const mapActionsToProps = {
    fetchLeaderboards
}

export default connect(mapStateToProps, mapActionsToProps)(Leaderboards)
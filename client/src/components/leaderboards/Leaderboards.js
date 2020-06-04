import React, { Fragment } from 'react'

import { Tabs, Table, Spin } from 'antd'
import { antIcon } from '../../functions/utils'

import { connect } from 'react-redux'
import { LOADING_LEADERBOARDS, SET_ERRORS } from '../../redux/types'
import store from '../../redux/store'
import { fetchLeaderboards } from '../../redux/actions/leaderboardActions'
import './Leaderboards.less'

import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

const { TabPane } = Tabs

const Leaderboards = (props) => {
    const { leaderboards, user } = props
    let { loadingLeaderboards } = props
    const { sport, year, season, week } = props.sport.gameWeekData
    const {params} = props.match
    if ((!params.sport || !params.year || !params.season || !params.week !== week) && (sport && year && season && week)) {
        window.history.pushState({}, '', `/${sport}/leaderboards/${year}/${season}/${week}`)
    }
    // console.log('sport, year, season, week', sport, year, season, week)
    const { weekly, overall } = leaderboards.leaderboards
    if ((!weekly || !overall) && !loadingLeaderboards && sport && year && season && week) {
        loadingLeaderboards = true;
        setTimeout(() => {
            props.fetchLeaderboards(sport, year, season, week)
        }, 100)
    }
    const leaderboardArray = weekly
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
                <Fragment>
                    <Spin className="loadingIndicator" indicator={antIcon} />
                </Fragment>
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

const mapActionsToProps = (dispatch) => ({
    fetchLeaderboards: async (sport, year, season, week) => {
        dispatch({
            type: LOADING_LEADERBOARDS
        })
        try {
            let leaderboardResponse = await fetchLeaderboards(sport, year, season, week)
            dispatch(leaderboardResponse)
        }catch (leaderboardResponseError) {
            dispatch({
                type: SET_ERRORS,
                errors: leaderboardResponseError
            })
        }
    }
})

export default connect(mapStateToProps, mapActionsToProps)(Leaderboards)
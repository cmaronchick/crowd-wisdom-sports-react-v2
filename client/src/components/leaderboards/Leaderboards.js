import React, { Fragment } from 'react'

import { Tabs, Table, Spin, Typography } from 'antd'
import Icon from '@ant-design/icons'
import { antIcon } from '../../functions/utils'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { fetchLeaderboards, selectLeaderboardType } from '../../redux/actions/leaderboardActions'
import { selectSeason } from '../../redux/actions/sportActions'
import { getUserPredictions } from '../../redux/actions/predictionsActions'
import './Leaderboards.less'
import LeaderboardSelector from './LeaderboardSelector'
import SeasonSelector from '../seasonSelector/SeasonSelector'
import LoginButton from '../profile/LoginButton'
import { FaFacebook } from 'react-icons/fa'
import { AiOutlineArrowRight } from 'react-icons/ai'


import Weeks from '../weeks/Weeks'

const { Title } = Typography
const { TabPane } = Tabs

const Leaderboards = (props) => {
    const { leaderboards, user,selectSeason } = props
    let { loadingLeaderboards, leaderboardType } = leaderboards
    const { sport, year, season, week } = props.sport.gameWeekData
    const {params} = props.match
    const { weekly, overall } = leaderboards.leaderboards
    // console.log(`weekly`, weekly)
    /* check for leaderboard data - !weekly || !overall
    if no leaderboard data, check for loading state - !loadingLeaderboards
    if not loading, fetch leaderboard data using the sport data in the redux store
    the params in the URL set the redux store data in the App.js componentDidMount method

    NOTE: the setTimeout is to allow the component to render completely before fetching data
    */ 
    if ((!weekly || !overall) && !loadingLeaderboards && sport && year && season && week) {
        loadingLeaderboards = true;
        if (props.user.authenticated) {
            setTimeout(() => {
                props.fetchLeaderboards(sport, year, season, week)
            }, 100)
        }
    }


    if ((!params.sport || !params.year || !params.season || !params.week !== week) && (sport && year && season && week)) {
        window.history.pushState({}, '', `/${sport}/leaderboards/${year}/${season}/${week}`)
    }

    // setting column information for the antd Table
    /*{
            title: 'User',
            dataIndex: 'username',
            key: 'username',
            render: (username) => {
                return (<div>{username.indexOf('Facebook') > -1 && (<a href="https://www.facebook.com/paulcullin/"><Icon component={() => <FaFacebook title="Facebook Profile" className="drawerIcon" />}/></a>)}</div>)
            },
            fixed: 'left',
            width: 150
        },*/
    const predictionScoreColumns = [
        {
            title: 'User',
            dataIndex: 'preferred_username',
            key: 'username',
            render: (preferred_username) => {
                return (<div><Link to={`/user/predictions/${preferred_username}/${week}`}>{preferred_username}<AiOutlineArrowRight /></Link></div>)
            },
            fixed: 'left',
            width: 150
        },
        {
            title: 'Prediction Score',
            dataIndex: 'predictionScore',
            width: 100,
            sorter: (a,b) => a.predictionScore - b.predictionScore,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Winners',
            dataIndex: 'winner',
            render: (winner) => (
                <span>
                    {winner.correct}
                </span>
            ),
            width: 100,
            sorter: (a,b) => a.winner.correct - b.winner.correct,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Spread',
            dataIndex: 'spread',
            render: (spread) => (
                <span>
                    {spread.correct}
                </span>
            ),
            width: 100,
            sorter: (a,b) => a.spread.correct - b.spread.correct,
            defaultSortOrder: 'descend'
        },
        {
            title: 'Total',
            dataIndex: 'total',
            render: (total) => (
                <span>
                    {total.correct}
                </span>
            ),
            width: 100,
            sorter: (a,b) => a.total.correct - b.total.correct,
            defaultSortOrder: 'descend'
        }

    ]

    const stakesColumns = [
        {
            title: 'User',
            dataIndex: 'preferred_username',
            key: 'username',
            fixed: 'left',
            width: 100
        },
        {
            title: 'Stakes Wagered',
            dataIndex: 'stars',
            render: (stars) => (
                <span>
                    {stars.wagered}
                </span>
            ),
            sorter: (a,b) => a.stars.wagered - b.stars.wagered,
            defaultSortOrder: 'descend',
            width: 100

        },
        {
            title: 'Net Stakes',
            dataIndex: 'stars',
            render: (stars) => (
                <span>
                    {stars.net}
                </span>
            ),
            sorter: (a,b) => a.stars.net - b.stars.net,
            defaultSortOrder: 'descend',
            width: 100

        },
        {
            title: 'ROI',
            dataIndex: 'stars',
            render: (stars) => (
                <span>
                    {(stars.roi * 100).toFixed(1)}%
                </span>
            ),
            sorter: (a,b) => a.stars.roi - b.stars.roi,
            defaultSortOrder: 'descend',
            width: 100

        }
    ]
    if (!loadingLeaderboards) {
        // console.log('weekly.users', weekly ? weekly.users : null)
        // console.log('overall.users: ', overall ? overall.users : null)
    }
    const extraContent = <LeaderboardSelector leaderboardType={props.leaderboards.leaderboardType} handleChangeLeaderboardType={props.selectLeaderboardType} />
    return props.user.authenticated ? (
        <div className="leaderboardContainer">
            <Title className="title">{year} Leaderboards</Title>
            <div className="selectorHeader">
                <SeasonSelector
                season={season}
                selectSeason={selectSeason} />
                <Weeks loading={loadingLeaderboards} onGameWeekClick={props.fetchLeaderboards} page="leaderboards" />
            </div>
            {!loadingLeaderboards ? (
                <Tabs
                defaultActiveKey="1"
                style={{position: 'relative'}}
                tabBarExtraContent={extraContent}
                centered={true}
                >
                    <TabPane tab="Weekly" key="1">
                        {weekly && weekly.users ? (
                            <Table
                            scroll={{x: 550}}
                             rowKey="username"
                                dataSource={
                                    leaderboardType === 'predictionScore' ? weekly.users.sort((a,b) => a.predictionScore > b.predictionScore ? -1 : 1)
                                        : weekly.usersStars.sort((a,b) => a.stars.net > b.stars.net ? -1 : 1)}
                                        columns={leaderboardType === 'predictionScore' ? predictionScoreColumns : stakesColumns}
                            pagination={false}/>
                        ) : (
                            <div>No Weekly Leaderboard</div>
                        )}
                    </TabPane>
                    <TabPane tab="Overall" key="2">
                        {overall && overall.users ? (
                            <Table rowKey="username"
                            scroll={{x: 550}}
                                dataSource={
                                    leaderboardType === 'predictionScore' ? overall.users.sort((a,b) => a.predictionScore > b.predictionScore ? -1 : 1)
                                : overall.usersStars.sort((a,b) => a.stars.net > b.stars.net ? -1 : 1)}
                                columns={leaderboardType === 'predictionScore' ? predictionScoreColumns : stakesColumns}
                                pagination={false}/>
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
    ) : (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px'}}>
            <LoginButton />
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
    fetchLeaderboards,
    selectLeaderboardType,
    selectSeason,
    getUserPredictions
}

export default connect(mapStateToProps, mapActionsToProps)(Leaderboards)
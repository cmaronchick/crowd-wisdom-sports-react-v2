import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

import { Table, Spin } from 'antd'
import { antIcon } from '../../functions/utils'

import { connect } from 'react-redux'
import { fetchGroups, fetchGroup } from '../../redux/actions/groupActions'

import './Groups.less'

const Groups = ({sportObj, groupsObj, fetchGroup, loadingGroups, fetchGroups, match}) => {
    const { sport, year, season, week } = sportObj.gameWeekData
    const { groups } = groupsObj ? groupsObj : { groups: {}}
    console.log('groups', groups)
    const {params} = match
    if (Object.keys(groups).length === 0 && !loadingGroups && sport && year && season) {
        setTimeout(() => {
            fetchGroups(sport, year, season)
        }, 1000)
    }
    if ((!params.sport || !params.year || !params.season || !params.week !== week) && (sport && year && season && week)) {
        window.history.pushState({}, '', `/${sport}/groups/${year}/${season}/${week}`)
    }

    const onGroupClick = (sport, year, season, groupId) => {
        fetchGroup(sport, year, season, groupId)
    }

    const columns = [
        {
            title: 'Group',
            dataIndex: 'groupName',
            key: 'groupName',
            render: (groupName, record) => {
                return (
                    <Link onClick={() => onGroupClick(record.sport, record.year, season, record.groupId)} to={`/${sport}/groups/${year}/${season}/group/${record.groupId}`}>
                        {groupName}
                    </Link>
                )
                }
        },
        {
            title: 'Prediction Score',
            dataIndex: 'results',
            render: (results) => (
                <span>
                    {results ? results[sport][year][season].overall.predictionScore : 0}
                </span>
            )
        }

    ]
    return (
        
        <div className="groupsContainer">
            <h1>Stakehouse Sports Groups</h1>
            <div className="selectorHeader">
                <SeasonSelector />
                <Weeks loading={loadingGroups} onGameWeekClick={fetchGroups} page="groups" />
            </div>
            {!loadingGroups ? (
            Object.keys(groups).length > 0 ? (
                <Fragment>
                        
                    <Table rowKey="groupName" dataSource={groups} columns={columns} />
                </Fragment>
            ) : (
                <div>
                    <h1>No Groups Available</h1>
                </div>
            )
        ) : (
            <Fragment>
                <Spin className="loadingIndicator" indicator={antIcon} />
            </Fragment>

        )}
    </div>
    )
};

Groups.propTypes = {
    groupsObj: PropTypes.object.isRequired,
    loadingGroups: PropTypes.bool.isRequired,
    sportObj: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    sportObj: state.sport,
    groupsObj: state.groups,
    loadingGroups: state.groups.loadingGroups
})

const mapActionsToProps = {
    fetchGroups,
    fetchGroup
}

export default connect(mapStateToProps, mapActionsToProps)(Groups);

import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import CreateGroupModal from './CreateGroupModal'
import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

import { Table, Spin, Button, Typography, Row, Col } from 'antd'
import { antIcon } from '../../functions/utils'

import { connect } from 'react-redux'
import { fetchGroups, fetchGroup } from '../../redux/actions/groupActions'
import { toggleCreateGroupModal } from '../../redux/actions/uiActions'

import './Groups.less'

const { Title, Text } = Typography

const Groups = (props) => {
    const {sportObj, groupsObj, fetchGroup, loadingGroups, fetchGroups, match, user} = props
    const { sport, year, season, week } = sportObj.gameWeekData
    const { groups } = groupsObj ? groupsObj : { groups: {}}
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
        
        <Row className="groupsContainer">
            <Col span={24}>
            <Row className="groupHeader" align="middle">
                <Col span={20}>
                    <Title>Stakehouse Sports Groups</Title>
                </Col>
                <Col span={4}>
                    <Button disabled={!user.authenticated} type="primary" className="createGroupButton" onClick={() => props.toggleCreateGroupModal(true)}>
                        Create Group
                    </Button>
                </Col>
            </Row>
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
        </Col>
        <CreateGroupModal />
    </Row>
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
    loadingGroups: state.groups.loadingGroups,
    user: state.user
})

const mapActionsToProps = {
    fetchGroups,
    fetchGroup,
    toggleCreateGroupModal
}

export default connect(mapStateToProps, mapActionsToProps)(Groups);

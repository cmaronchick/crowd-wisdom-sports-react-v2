import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import JoinCrowdButton from './JoinGroupButton'

import { connect } from 'react-redux'
import { fetchGroup } from '../../redux/actions/groupActions'

import { Table, Spin, Typography, Form, Input} from 'antd'
import { antIcon } from '../../functions/utils'

const { Title, Text } = Typography

const Group = ({user, group, loadingGroup, sportObj, fetchGroup, match}) => {
    const { groupId, groupName, users, memberOf } = group
    const isPublicGroup = group.public
    let { sport, year } = group
    sport = sport ? sport : sportObj.gameWeekData.sport
    year = year ? year : sportObj.gameWeekData.year
    const { season } = sportObj.gameWeekData
    const { params } = match
    console.log('params', params)


    /* check for group data - !groupNamd
    if no group data, check for loading state - !loadingGroup
    if not loading, fetch group data using the group data in the url params

    NOTE: the setTimeout is to allow the component to render completely before fetching data
    */ 
    if (!groupName && !loadingGroup && sportObj.sport && sportObj.gameWeekData.year && sportObj.gameWeekData.season && params.groupId) {
        console.log('sport, year, season, params.groupId', sport, year, season, params.groupId)
        loadingGroup = true;
        setTimeout(() => {
            fetchGroup(sport, parseInt(year), season, parseInt(params.groupId))
        }, 100)
    }


    /* 
    Set up columns 
    */
    const columns = [
        {
            title: 'Username',
            dataIndex: 'preferred_username',
            key: 'preferred_username',
            render: (preferred_username, record) => {
                return (
                    // <Link onClick={() => onGroupClick(record.sport, record.year, season, record.groupId)} to={`/${sport}/groups/${year}/${season}/group/${record.groupId}`}>
                    <span>
                        {preferred_username}
                    </span>
                    // </Link>
                )
                }
        },
        {
            title: 'Prediction Score',
            dataIndex: 'results',
            render: (results) => (
                <span>
                    {results ? results.weekly[0].predictionScore : 0}
                </span>
            )
        }

    ]
    console.log('users', users)
    return (
        <div className="groupContainer">
            {/* check that group is done loading and has data */}
            {!loadingGroup && group.groupId ? (memberOf || isPublicGroup ? (
                <Fragment>
                    <div className="groupHeader">
                    <h1>{groupName}</h1>
                    {group && group.owner && user.attributes && (
                        <JoinCrowdButton btnClassName="joinGroupButton" authenticated={user.authenticated} isOwner={group.owner.preferred_username === user.attributes.preferred_username} memberOf={group.memberOf} />
                    )}
                    </div>
                    <Table rowKey="username" columns={columns} dataSource={users} />
                </Fragment>
            ) : (
                <div className="lockedGroup">
                    <Text type="danger">You must be a member of this group to view.</Text>
                    <Form>
                        <Form.Item
                        label="Group Password"
                        name="groupPassword"
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                    <JoinCrowdButton btnClassName="joinGroupButton" authenticated={user.authenticated} isOwner={group.owner.preferred_username === user.attributes.preferred_username} memberOf={group.memberOf} />
                </div>)
            ) : (
                <Fragment>
                    <Spin className="loadingIndicator" indicator={antIcon} />
                </Fragment>
            )}
        </div>
    )
};

Group.propTypes = {
    user: PropTypes.object.isRequired,
    sportObj: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    sportObj: state.sport
})

const mapActionsToProps = {
    fetchGroup
}

export default connect(mapStateToProps, mapActionsToProps)(Group);

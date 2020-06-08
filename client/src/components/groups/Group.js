import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import JoinCrowdButton from './JoinGroupButton'

import { connect } from 'react-redux'
import { fetchGroup, joinGroup, leaveGroup, selectGroupSeason } from '../../redux/actions/groupActions'

import { Table, Spin, Typography, Form, Input, Row, Col} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { antIcon } from '../../functions/utils'

import SeasonSelector from '../seasonSelector/SeasonSelector'

const { Title, Text } = Typography

const Group = ({user, group, loadingGroup, sportObj, fetchGroup, selectGroupSeason, joinGroup, leaveGroup, match, history}) => {
    const { groupId, groupName, users, memberOf, results } = group
    const isPublicGroup = group.public
    let { sport, year } = group
    sport = sport ? sport : sportObj.gameWeekData.sport
    year = year ? year : sportObj.gameWeekData.year
    console.log('group.selectedSeason', group.selectedSeason)
    const season = group.selectedSeason ? group.selectedSeason : sportObj.gameWeekData.season
    const { params } = match

    const handleSelectSeason = (selectedSeason) => {
        console.log('sport, year', sport, year)
        selectGroupSeason(sport, year, selectedSeason, groupId)
    }

    /* check for group data - !groupName
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
        }

    ]
    let weekbyWeekChildren = []
    if (results) {
        results[sport][year][season].weekly.sort((a,b) => a.gameWeek - b.gameWeek).forEach((weekResult, weekIndex) => {
            weekbyWeekChildren.push(
                {
                    title: `${weekResult.gameWeek}`,
                    dataIndex: ['results', 'weekly', weekIndex],
                    render: (predictionScore, record, index) => {
                        return (
                            <span>
                                {predictionScore && predictionScore.gameWeek === weekResult.gameWeek ? predictionScore.predictionScore : 0}
                            </span>
                        )
                    }
                }
            )
        })
        columns.push({
            title: 'Week',
            children: weekbyWeekChildren
        })

        columns.push(
            {
                title: 'Total',
                dataIndex: 'results',
                render: (results) => (
                    <span>
                        {results ? results.overall.predictionScore : 0}
                    </span>
                )
            })
    }

    return (
        <div className="groupContainer">
            <Row>
                <Col span={24}>
            {/* check that group is done loading and has data */}
            {!loadingGroup && group.groupId ? (memberOf || isPublicGroup ? (
                <Fragment>
                    <Row className="groupHeader">

                    <Col span={4}>
                        <ArrowLeftOutlined className="backButton" onClick={() => history.push(`/${sport}/groups/${year}/${season}`)} />
                    </Col>
                    <Col span={12}>
                        <h1>{groupName}</h1>
                    </Col>
                    <Col span={8} flex="row">
                        {/* Only show season selector if number of season results is greater than 1 */}
                        {(results && results[sport][year] && Object.keys(results[sport][year]).length > 1 && 
                        <SeasonSelector handleSelectSeason={handleSelectSeason} />
                        )}
                        {group && group.owner && user.attributes && (
                            <JoinCrowdButton
                                btnClassName="joinGroupButton"
                                authenticated={user.authenticated}
                                isOwner={group.owner.preferred_username === user.attributes.preferred_username}
                                memberOf={group.memberOf}
                                joinGroupClick={joinGroup}
                                leaveGroupClick={leaveGroup}/>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Table className="groupTable" scroll={{x: true}} rowKey="username" columns={columns} dataSource={users} />
                </Row>
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
                </Col>
            </Row>
        </div>
    )
};

Group.propTypes = {
    user: PropTypes.object.isRequired,
    sportObj: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    fetchGroup: PropTypes.func.isRequired,
    joinGroup: PropTypes.func.isRequired,
    leaveGroup: PropTypes.func.isRequired,
    selectGroupSeason: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    group: state.groups.group,
    loadingGroup: state.groups.loadingGroup,
    sportObj: state.sport
})

const mapActionsToProps = {
    fetchGroup,
    joinGroup,
    leaveGroup,
    selectGroupSeason
}

export default connect(mapStateToProps, mapActionsToProps)(Group);

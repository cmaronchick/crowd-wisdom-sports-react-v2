import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import JoinCrowdButton from './JoinGroupButton'

import { connect } from 'react-redux'
import { fetchGroup, joinGroup, leaveGroup, selectGroupSeason, updateGroupDetails, uploadGroupImage } from '../../redux/actions/groupActions'
import { fetchGameWeekGames, fetchGame } from '../../redux/actions/gamesActions'
import { onChangeText } from '../../redux/actions/uiActions'
import { isEmail, handleEditPicture, handleImageChange } from '../../functions/utils'

import { Tabs, Table, Spin, Typography, Form, Input, Row, Col, Button, Popconfirm} from 'antd'
import { ArrowLeftOutlined, MailOutlined, ShareAltOutlined, EditOutlined } from '@ant-design/icons'
import { antIcon } from '../../functions/utils'

import GamesList from '../gamesList/GamesList'
import SeasonSelector from '../seasonSelector/SeasonSelector'
import Weeks from '../weeks/Weeks'

const { Title, Text } = Typography
const { TabPane } = Tabs

const EditIcon = () => (<EditOutlined style={{color: '#fff'}} color={'#fff'} />)

const Group = ({
    user,
    group,
    loadingGroup,
    sportObj,
    UI,
    fetchGroup,
    selectGroupSeason,
    joinGroup,
    leaveGroup,
    updateGroupDetails,
    uploadGroupImage,
    onChangeText,
    fetchGameWeekGames,
    fetchGame,
    games,
    predictions,
    match,
    history}) => {
    const { groupId, groupName, users, memberOf, joiningGroup, results, picture } = group
    const isPublicGroup = group.public
    let { sport, year } = group
    sport = sport ? sport : sportObj.gameWeekData.sport
    year = year ? year : sportObj.gameWeekData.year
    const season = group.selectedSeason ? group.selectedSeason : sportObj.gameWeekData.season
    const { params } = match

    const handleSelectSeason = (selectedSeason) => {
        console.log('sport, year', sport, year)
        selectGroupSeason(sport, year, selectedSeason, groupId)
    }
    const handleJoinGroupClick = () => {
        console.log('UI.groupPassword', UI.groupPassword)
        joinGroup(sport, year, groupId, UI.groupPassword)
    }
    const handleLeaveGroupConfirm = () => {
        leaveGroup(sport, year, groupId)
    }

    const handleInviteClick = () => {
        navigator.clipboard.writeText(window.location.href)
    }
    
    const handleTitleChange = (updatedGroupName) => {
        updateGroupDetails({
            ...group,
            groupName: updatedGroupName
        })
    }

    const updateGroupImage = (updatedGroupPicture) => {
        console.log('updatedGroupPicture', updatedGroupPicture)
        updateGroupDetails({
            ...group,
            picture: updatedGroupPicture
        })
    }

    /* check for group data - !groupName
    if no group data, check for loading state - !loadingGroup
    if not loading, fetch group data using the group data in the url params

    NOTE: the setTimeout is to allow the component to render completely before fetching data
    */ 
    if (!groupName && !loadingGroup && sportObj.sport && sportObj.gameWeekData.year && sportObj.gameWeekData.season && params.groupId) {
        // console.log('sport, year, season, params.groupId', sport, year, season, params.groupId)
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
    if (results && results[sport][year][season].weekly) {
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
            <Row className="groupRow">
                <Col span={24}>
            {/* check that group is done loading and has data */}
            {!loadingGroup && group.groupId ? (memberOf || isPublicGroup ? (
                <Fragment>
                    <Row className="groupHeader">
                    <Col span={4}>
                        <ArrowLeftOutlined className="backButton" onClick={() => history.push(`/${sport}/groups/${year}/${season}`)} />
                    </Col>
                    <Col span={12} className="groupName">
                        {picture && (
                            <Fragment>
                            <input type='file' hidden='hidden' id='imageInput' onChange={(event) => {
                                handleImageChange(event)
                                updateGroupImage(event.target.files[0])
                            }}/>
                            <img onClick={group.owner.username === user.username ? handleEditPicture : null} id="avatarImage" src={picture} alt={groupName} className="groupAvatar" />
                            </Fragment>
                        )}
                        <Title level={3} editable={group.owner.username === user.username ? { onChange: handleTitleChange,
                        icon: (<EditIcon />)} : false} style={{backgroundColor: '#0a1f8f'}}
                        >{groupName}</Title>
                    </Col>
                    <Col span={8} flex="row">
                        {/* Only show season selector if number of season results is greater than 1 */}
                        {(results && results[sport][year] && Object.keys(results[sport][year]).length > 1 && 
                            <SeasonSelector handleSelectSeason={handleSelectSeason} />
                        )}

                        <Popconfirm
                        placement="topRight"
                        title={`Copy Group URL to Clipboard?`}
                        onConfirm={handleInviteClick}
                        okText="Confirm"
                        okType="danger"
                        cancelText="Cancel"
                        >
                        <Button>
                            <ShareAltOutlined />
                        </Button>
                        </Popconfirm>
                        {group && group.owner && user.attributes && (
                            <JoinCrowdButton
                                joiningGroup={joiningGroup}
                                btnClassName="joinGroupButton"
                                authenticated={user.authenticated}
                                isOwner={(group.owner.preferred_username === user.attributes.preferred_username || group.owner.preferred_username === user.username)}
                                memberOf={group.memberOf}
                                groupName={groupName}
                                handleJoinGroupClick={handleJoinGroupClick}
                                handleLeaveGroupConfirm={handleLeaveGroupConfirm}/>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Tabs className="groupLeaderboard">
                            <TabPane tab="Leaderboard" key="1">
                                <Table className="groupTable" scroll={{x: true}} rowKey="username" columns={columns} dataSource={users} />
                            </TabPane>
                            <TabPane tab="Predictions" key="2">
                                {games && Object.keys(predictions.group).length > 0 ? (
                                    <Fragment>
                                        <div className="selectorHeader">
                                            <SeasonSelector />
                                            <Weeks onGameWeekClick={fetchGameWeekGames} page="group" />
                                        </div>
                                        {console.log('[{...predictions.user},{...predictions.group}]', [{...predictions.user},{...predictions.group}])}
                                        <GamesList
                                        sport={sportObj}
                                        games={games}
                                        page="groups"
                                        predictions={{user: predictions.user, group: predictions.group}}
                                        loadingGames={loadingGroup}
                                        fetchGameWeekGames={fetchGameWeekGames}
                                        fetchGame={fetchGame} />
                                    </Fragment>
                                ) : (
                                    <Text type="secondary">No Group Predictions Yet</Text>
                                )}
                            </TabPane>

                        </Tabs>
                    </Col>
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
                            <Input name="groupPassword" onChange={onChangeText} />
                        </Form.Item>
                    </Form>
                    {UI.errors && (<Text type="warning">{UI.errors}</Text>)}
                    
                    <JoinCrowdButton
                        joiningGroup={joiningGroup}
                        loadingGroup={loadingGroup}
                        btnClassName="joinGroupButton"
                        authenticated={user.authenticated}
                        isOwner={group.owner.preferred_username === user.attributes.preferred_username}
                        memberOf={group.memberOf}
                        groupName={groupName}
                        handleJoinGroupClick={handleJoinGroupClick}
                        handleLeaveGroupConfirm={handleLeaveGroupConfirm}/>
                </div>)
            ) : loadingGroup ? (
                <Fragment>
                    <Spin title="Loading Group" className="loadingIndicator" indicator={antIcon} />
                </Fragment>
            ) : (
                <div>No Group Found</div>
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
    selectGroupSeason: PropTypes.func.isRequired,
    games: PropTypes.object.isRequired,
    predictions: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    user: state.user,
    group: state.groups.group,
    predictions: state.predictions,
    loadingGroup: state.groups.loadingGroup,
    sportObj: state.sport,
    games: state.games.games,
    UI: state.UI
})

const mapActionsToProps = {
    fetchGroup,
    joinGroup,
    leaveGroup,
    selectGroupSeason,
    onChangeText,
    fetchGameWeekGames,
    fetchGame,
    updateGroupDetails,
    uploadGroupImage
}

export default connect(mapStateToProps, mapActionsToProps)(Group);

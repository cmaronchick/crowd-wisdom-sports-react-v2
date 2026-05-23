import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import { toggleLoginModal } from '../../redux/actions/uiActions'
import { updateUserDetails, changePassword, changeUserDetails, uploadImage } from '../../redux/actions/userActions'
import { getUserPredictions } from '../../redux/actions/predictionsActions'
import { LOADING_USER} from '../../redux/types'

import LoginButton from './LoginButton'

//MUI Stuff
import { Card, Typography, Form, Input, Button, Row, Col, Tabs, Table, Select, Spin } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import './Profile.less'

const { Title, Text } = Typography
const { TabPane } = Tabs

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

const Profile = (props) => {
    const { user, sport, predictions, changePassword, changeUserDetails, updateUserDetails, uploadImage, getUserPredictions } = props
    const { week, year, season } = sport.gameWeekData
    const activeSport = sport.sport

    const attributeNames = {
        email: 'E-mail',
        family_name: 'Last Name',
        given_name: 'First Name',
        preferred_username: 'Username'
    }

    useEffect(() => {
        if (user.authenticated && (user.attributes.preferred_username || user.username) && activeSport && year && season && week) {
            const username = user.attributes.preferred_username || user.username
            getUserPredictions(activeSport, year, season, week, username)
        }
    }, [user.authenticated, user.attributes.preferred_username, user.username, activeSport, year, season, week, getUserPredictions])

    const onChangeText = (event) => {
        changeUserDetails(event.target.name, event.target.value)
    }

    const handleDefaultWagerChange = (value) => {
        changeUserDetails('custom:defaultWager', value)
        localStorage.setItem('shs_default_wager', value)
    }

    const handleUpdateButtonClick = () => {
        updateUserDetails(user.updatedAttributes)
    }

    const handleImageChange = (event) => {
        const image = event.target.files[0]
        console.log('image', image)
        let formData = new FormData()
        formData.append('image', image, image.name);
        uploadImage(image)
    }
    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click();
    }
    const { picture, name } = user.attributes
    // const pictureData = JSON.parse(picture) ? JSON.parse(picture) : picture
    console.log('picture', picture)
    const src = picture && picture.indexOf('{') > -1 ? JSON.parse(picture).data.url : picture
    return (
        <Card className="profile">
            {user.authenticated ? (
                <Tabs defaultActiveKey="1" centered={true}>
                    <TabPane tab="Profile Settings" key="1">
                        <Form {...layout}>
                            <Title>{user.attributes.preferred_username}</Title>
                            <div className="profileWrapper">
                                <div className='image-wrapper'>
                                    <img style={{width: 50, height: 50}} src={src ? src : `https://firebasestorage.googleapis.com/v0/b/splitsbyspotify.appspot.com/o/blank-profile-picture.png?alt=media&token=a78e5914-43fd-4e0b-b22e-0ae216ad19c4`} alt={name} className='profileImage'/>
                                    <input type='file' hidden='hidden' id='imageInput' onChange={handleImageChange}/>
                                    <Button tip="Edit Profile Picture" 
                                        placement="top"
                                        onClick={handleEditPicture}
                                        type="primary">
                                            <EditOutlined />
                                    </Button>
                                </div>
                                <div className="profileDetails">
                                    {!user.attributes.preferred_username && (
                                    <Form.Item
                                        label="Username"
                                        name="preferred_username"
                                        initialValue={user.username}
                                        >
                                            <Input id="preferred_username" type="text" name="preferred_username" onChange={onChangeText} />
                                    </Form.Item>)}
                                    {Object.keys(user.attributes).map(attributeKey => {
                                        return attributeNames[attributeKey] ? (
                                            <Form.Item key={attributeKey}
                                            label={attributeNames[attributeKey]}
                                            name={attributeKey}
                                            initialValue={user.attributes[attributeKey]}
                                            >
                                                <Input
                                                    disabled={attributeKey === "preferred_username" && !user.attributes.identities}
                                                 id={attributeKey} type="text" name={attributeKey} onChange={onChangeText} />
                                            </Form.Item>
                                        ) : null
                                    })}
                                    <Form.Item
                                        label="Default Wager"
                                        name="custom:defaultWager"
                                    >
                                        <Select
                                            value={user.updatedAttributes['custom:defaultWager'] !== undefined ? user.updatedAttributes['custom:defaultWager'] : (user.attributes['custom:defaultWager'] || localStorage.getItem('shs_default_wager') || '1')}
                                            onChange={handleDefaultWagerChange}
                                        >
                                            <Select.Option value="1">1 Stake</Select.Option>
                                            <Select.Option value="2">2 Stakes</Select.Option>
                                            <Select.Option value="3">3 Stakes</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        loading={user.updatingUser}
                                        disabled={Object.keys(user.updatedAttributes).length === 0}
                                        onClick={() => handleUpdateButtonClick()}>
                                        Update User Profile
                                    </Button>
                                </div>
                            </div>
                            <div className="profileChangePassword">
                                <Form.Item
                                    label="Current Password"
                                    name="password">
                                    <Input.Password
                                        type="password"
                                        name="profileCurrentPassword"
                                        placeholder="Enter current password"
                                        onChange={onChangeText} />
                                </Form.Item>
                                <Form.Item name="newPassword"
                                label="New Password">
                                    <Input.Password type="password" name="profileNewPassword" placeholder="Enter new password" onChange={onChangeText} />
                                </Form.Item>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password">
                                    <Input.Password type="password" name="profileConfirmPassword" placeholder="Confirm password" onChange={onChangeText} />
                                </Form.Item>
                                <Button onClick={changePassword}>
                                    Change Password
                                </Button>
                            </div>
                        </Form>
                    </TabPane>
                    <TabPane tab="Wager History" key="2">
                        <div style={{ padding: '10px 0' }}>
                            <Title level={3} style={{ marginBottom: 20 }}>Wager History (Week {week})</Title>
                            {predictions?.comparedUser?.gettingPredictions ? (
                                <Row justify="center" style={{ padding: 40 }}>
                                    <Spin size="large" />
                                </Row>
                            ) : (
                                <Table
                                    rowKey="gameId"
                                    dataSource={predictions?.comparedUser?.predictions || []}
                                    columns={[
                                        {
                                            title: 'Away',
                                            dataIndex: 'awayTeam',
                                            key: 'awayTeam',
                                            render: (awayTeam) => (
                                                <div>
                                                    {awayTeam.code && <strong>{awayTeam.code} </strong>}
                                                    {awayTeam.score !== undefined ? awayTeam.score : ''}
                                                </div>
                                            )
                                        },
                                        {
                                            title: 'Home',
                                            dataIndex: 'homeTeam',
                                            key: 'homeTeam',
                                            render: (homeTeam) => (
                                                <div>
                                                    {homeTeam.code && <strong>{homeTeam.code} </strong>}
                                                    {homeTeam.score !== undefined ? homeTeam.score : ''}
                                                </div>
                                            )
                                        },
                                        {
                                            title: 'Spread Wager',
                                            key: 'spreadWager',
                                            render: (record) => {
                                                const wagered = record.results?.spread?.stars?.wagered;
                                                const net = record.results?.spread?.stars?.net;
                                                if (wagered === undefined || wagered === 0) return 'No Wager';
                                                return (
                                                    <span>
                                                        {wagered} {wagered === 1 ? 'stake' : 'stakes'} (
                                                        <span style={{ color: net > 0 ? '#52c41a' : net < 0 ? '#ff4d4f' : 'inherit', fontWeight: 'bold' }}>
                                                            {net > 0 ? `+${net}` : net}
                                                        </span>)
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            title: 'Total Wager',
                                            key: 'totalWager',
                                            render: (record) => {
                                                const wagered = record.results?.total?.stars?.wagered;
                                                const net = record.results?.total?.stars?.net;
                                                if (wagered === undefined || wagered === 0) return 'No Wager';
                                                return (
                                                    <span>
                                                        {wagered} {wagered === 1 ? 'stake' : 'stakes'} (
                                                        <span style={{ color: net > 0 ? '#52c41a' : net < 0 ? '#ff4d4f' : 'inherit', fontWeight: 'bold' }}>
                                                            {net > 0 ? `+${net}` : net}
                                                        </span>)
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            title: 'Net Stakes',
                                            key: 'netProfit',
                                            render: (record) => {
                                                const netSpread = record.results?.spread?.stars?.net || 0;
                                                const netTotal = record.results?.total?.stars?.net || 0;
                                                const totalNet = netSpread + netTotal;
                                                return (
                                                    <strong style={{ color: totalNet > 0 ? '#52c41a' : totalNet < 0 ? '#ff4d4f' : 'inherit' }}>
                                                        {totalNet > 0 ? `+${totalNet}` : totalNet}
                                                    </strong>
                                                );
                                            }
                                        }
                                    ]}
                                    pagination={false}
                                    locale={{ emptyText: 'No wagers submitted for this week.' }}
                                />
                            )}
                        </div>
                    </TabPane>
                </Tabs>
            ) : (
                <Row>
                    <Col span={24}>
                        <Row justify="center">
                            <Text type="secondary">Please log in or sign up.</Text>
                        </Row>
                        <Row justify="center">
                            <LoginButton />
                        </Row>
                    </Col>
                </Row>
            )}
        </Card>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    sport: state.sport,
    predictions: state.predictions
})

const mapActionsToProps = (dispatch) => ({
    toggleLoginModal,
    getUserPredictions: (sport, year, season, week, userId) => dispatch(getUserPredictions(sport, year, season, week, userId)),
    updateUserDetails: async (updatedAttributes) => {
            dispatch({ type: LOADING_USER })
        try {
            let updateResponse = await updateUserDetails(updatedAttributes)
            console.log('updateResponse', updateResponse)
            dispatch(updateResponse)
        } catch (updateUserError) {
            dispatch(updateUserError)
        }
    },
    changePassword,
    changeUserDetails: (name, value) => dispatch(changeUserDetails(name, value)),
    uploadImage: async (formData) => {
        console.log('formData', formData)
        dispatch({ type: LOADING_USER })
        try {
            
            let updateResponse = await uploadImage(formData)
            console.log('updateResponse', updateResponse)
            dispatch(updateResponse)

        } catch (uploadImageError) {
            console.log('uploadImageError', uploadImageError)
            dispatch(uploadImageError)
        }
    }
})

export default connect(mapStateToProps, mapActionsToProps)(Profile)
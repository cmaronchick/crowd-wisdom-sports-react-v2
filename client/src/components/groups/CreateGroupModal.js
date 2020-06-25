import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isEmail, handleEditPicture, handleImageChange } from '../../functions/utils'

import { Modal, Form, Input, Typography, Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { createGroup } from '../../redux/actions/groupActions'
import { onChangeText, onChangeCheckbox, toggleCreateGroupModal } from '../../redux/actions/uiActions'

import TrophyImage from '../../images/icons8-trophy-64.png'

const { Text } = Typography

export const CreateGroup = (props) => {
    const { user, sport, UI, groups} = props

    const handleCreateGroupButtonClick = () => {
        
        
      const picture = document.getElementById('imageInput').files.length > 0 ? document.getElementById('imageInput').files[0] : null
        props.createGroup({
            owner: {
                username: user.username,
                preferred_username: user.attributes.preferred_username ? user.attributes.preferred_username : user.username
            },
            groupName: UI.createGroupName,
            sport: sport.sport,
            year: sport.gameWeekData.year,
            season: sport.gameWeekData.season,
            public: UI.createGroupPublic ? UI.createGroupPublic : false,
            password: UI.createGroupPassword,
            picture
        })
    }

// "owner" : {
//     "username": "$context.authorizer.claims['cognito:username']",
//     "firstName": "$context.authorizer.claims['given_name']",
//     "lastName": "$context.authorizer.claims['family_name']",
//     "preferred_username": "$context.authorizer.claims['preferred_username']"
//     },
// "groupName": "$input.path('crowdName')",
// "sport": "$input.path('sport')",
// "year": $input.path('year'),
// "public": $input.path('public'),
// "password": "$input.path('crowdPassword')"

    return (
        <Modal
            footer={null}
            visible={UI.createGroupModalOpen}
            confirmLoading={groups.creatingGroup}
            onCancel={() => props.toggleCreateGroupModal(!UI.createGroupModalOpen)}
            title="Create a New Group">
                <Form>

                    <div className='image-wrapper'>
                        <Form.Item
                        label="Group Avatar">
                        <img id="avatarImage" style={{height: 30, width: 30}} src={TrophyImage} alt="group avatar" className='profileImage'/>
                        <input type='file' hidden='hidden' id='imageInput' onChange={handleImageChange}/>
                            <Button tip="Edit Group Picture" 
                                placement="top"
                                onClick={handleEditPicture}
                                type="primary">
                                    <EditOutlined />
                            </Button>
                        </Form.Item>
                    </div>
                    <Form.Item
                    label="Group Name">
                        <Input name="createGroupName" type="text" onChange={props.onChangeText} />
                    </Form.Item>
                    <Form.Item
                        label="Invite Only?">
                        <Input name="createGroupPublic" type="checkbox" onChange={props.onChangeCheckbox} />
                    </Form.Item>
                    {UI.createGroupPublic && (
                        <Form.Item
                        label="Group Password">
                            <Input name="createGroupPassword" type="text" placeholder="Password must be between 5 and 16 characters or longer" onChange={props.onChangeText} />
                        </Form.Item>
                    )}
                    <Button
                        disabled={!UI.createGroupName || (UI.createGroupPublic && (!UI.createGroupPassword || (UI.createGroupPassword.length > 16 || UI.createGroupPassword.length < 5)))}
                        type="primary"
                        onClick={handleCreateGroupButtonClick}
                        loading={groups.creatingGroup}>
                        Create
                    </Button>
                    {UI.errors && (
                        <div>
                            <Text type="danger">{UI.errors.name} {UI.errors.message}</Text>
                        </div>
                    )}
                </Form>
        </Modal>
    )
}

CreateGroup.propTypes = {
    user: PropTypes.object.isRequired,
    sport: PropTypes.object.isRequired,
    createGroup: PropTypes.func.isRequired,
    toggleCreateGroupModal: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    user: state.user,
    sport: state.sport,
    groups: state.groups
})

const mapDispatchToProps = {
    createGroup,
    toggleCreateGroupModal,
    onChangeText,
    onChangeCheckbox
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup)

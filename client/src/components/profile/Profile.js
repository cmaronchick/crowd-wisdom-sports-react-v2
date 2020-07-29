import React from 'react'

import { connect } from 'react-redux'
import { toggleLoginModal } from '../../redux/actions/uiActions'
import { updateUserDetails, changePassword, changeUserDetails, uploadImage } from '../../redux/actions/userActions'
import { LOADING_USER} from '../../redux/types'

import LoginButton from './LoginButton'

//MUI Stuff
import { Card, Typography, Form, Input, Button, Row, Col} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import ProfileLess from './Profile.less'

const { Title, Text } = Typography

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

const Profile = (props) => {
    const { user, loginModalShow, newPassword, confirmPassword, passwordMatch, changePassword, changeUserDetails, updateUserDetails, uploadImage } = props

    const attributeNames = {
        email: 'E-mail',
        family_name: 'Last Name',
        given_name: 'First Name',
        preferred_username: 'Username'
    }

    const onChangeText = (event) => {
        changeUserDetails(event.target.name, event.target.value)
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
                    {Object.keys(user.attributes).map(attributeKey => {
                        return attributeNames[attributeKey] ? (
                            <Form.Item key={attributeKey}
                            label={attributeNames[attributeKey]}
                            name={attributeKey}
                            initialValue={user.attributes[attributeKey]}
                            >
                                <Input id={attributeKey} type="text" name={attributeKey} onChange={onChangeText} />
                            </Form.Item>
                        ) : null
                    })}
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
    user: state.user
})

const mapActionsToProps = (dispatch) => ({
    toggleLoginModal,
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
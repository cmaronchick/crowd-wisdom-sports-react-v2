import './Header.less'

import React from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { logout, deleteAccount } from '../../../redux/actions/userActions'

import logo from '../../../images/stake-image-gold-dual-ring.svg'
import LoginButton from '../../profile/LoginButton'
import { Layout, Typography, Button, Dropdown, Menu, Popconfirm } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, UserOutlined } from '@ant-design/icons'

import ReactGA from 'react-ga'
const { Text } = Typography;

const { Header } = Layout

const StakehouseHeader = ({ message,user, logout, deleteAccount }) => {

  const profileChoices = (
  
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          {window.innerWidth < 800 ? (
            <span>{user.attributes.preferred_username}</span>
          ) : (
            <span>My Profile</span>
          )}
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Button type="primary" onClick={() => logout()}>
          Logout
        </Button>
      </Menu.Item>
      <Menu.Item key="delete">
        <Popconfirm className='deleteAccountPopconfirm'
            title="Are you sure you want to delete your account?"
            description="Are you sure you want to delete your account?"
            onConfirm={() => {

                ReactGA.event({
                    category: 'account',
                    action: 'delete',
                    label: 'confirm',
                    value: 1
                })
                deleteAccount(true)
            }}
            onCancel={() => {

                ReactGA.event({
                    category: 'account',
                    action: 'delete',
                    label: 'confirm',
                    value: 0
                })
                console.log('cancel')
            }}
            okText="Confirm"
            okButtonProps={{ type: 'danger', size: 'small', className: 'deleteAccountConfirmButton' }}
            cancelText="No - Back to Safety"
            cancelButtonProps={{ type: 'primary', size: 'large', className: 'deleteAccountCancelButton' }}
>
          <Button type='danger' size="large">
              Delete
          </Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  )

  return (
    <Header className="header">
      <Link to="/">
        <img src={logo} alt="Stakehouse Sports" className="headerImage" />
      </Link>
      {window.innerWidth < 768 ? (
        <span className="headerText">
          SHS
        </span>
      ) : (
        <span className="headerText">
          Stakehouse Sports
        </span>
      )}
      {message && (
        <Text type="warning">{message}</Text>
      )}
      {!user.authenticated ? (
        <LoginButton buttonClass="headerButton" />
      ) : (
      <Dropdown overlay={profileChoices}>
        <a href="#profile" className="ant-dropdown-link headerUserDropdown" overlay={profileChoices} onClick={e => e.preventDefault()}>
          {window.innerWidth < 500 ? (
            <UserOutlined />
          ) : (
            user.attributes.preferred_username
          )}
          <DownOutlined />
        </a>
      </Dropdown>
      )}

    </Header>
  );
};

StakehouseHeader.propTypes = {
  message: PropTypes.string,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
})

const mapActionsToProps = {
  logout,
  deleteAccount
}

export default connect(mapStateToProps, mapActionsToProps)(StakehouseHeader);

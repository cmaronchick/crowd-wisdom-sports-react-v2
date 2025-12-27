import './Header.less'

import React from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { logout } from '../../../redux/actions/userActions'

import logo from '../../../images/stake-image-brown.png'
import LoginButton from '../../profile/LoginButton'
import { Layout, Typography, Button, Dropdown, Menu } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
const { Text } = Typography;

const { Header } = Layout

const StakehouseHeader = ({ message, user, logout }) => {

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
  logout
}

export default connect(mapStateToProps, mapActionsToProps)(StakehouseHeader);

import './header.css'

import React, { Button } from 'react';
import PropTypes from 'prop-types'
import logo from '../../../images/stake-image-brown.svg'
import { Layout, Typography } from 'antd'
const { Title, Paragraph, Text } = Typography;

const { Header } = Layout
const StakehouseHeader = ({ message }) => {
  return (
    <Header className="header">
      <img src={logo} alt="Stakehouse Sports" className="headerImage" />
      Stakehouse Sports
      {message && (
        <Text type="warning">{message}</Text>
      )}
    </Header>
  );
};

Header.propTypes = {
  message: PropTypes.string
};

export default StakehouseHeader;

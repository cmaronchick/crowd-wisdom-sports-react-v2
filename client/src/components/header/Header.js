import './header.css'

import React, { Button } from 'react';
import logo from '../../images/stake-image.png'
import { Typography } from 'antd'
const { Title, Paragraph, Text } = Typography;

const Header = ({ message }) => {
  return (
    <div className="header">
      <img src={logo} alt="Stakehouse Sports" style={{width: 30, height: 30}} />
      <Typography>
        <Title>Stakehouse Sports</Title>
        {message && (
          <Paragraph>{message}</Paragraph>
        )}
      </Typography>
    </div>
  );
};

// Header.propTypes = {
//   message: React.propTypes.string
// };

export default Header;

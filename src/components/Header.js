import React, { Button } from 'react';
import PropTypes from 'prop-types'

const Header = ({ message }) => {
  return (
    <div>
      <h2 className="Header text-center">
        {message}
      </h2>
      
    </div>
  );
};

// Header.propTypes = {
//   message: React.propTypes.string
// };

export default Header;

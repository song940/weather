import React from 'react';

import './index.css';

const Header = ({ city }) => {
  return (
    <header>
      <h1>Weather - {city}</h1>
    </header>
  );
};

export default Header;
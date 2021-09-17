import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import MaterialIcon, { flutter_dash } from 'material-icons-react';

const Header = () => {
  return (
    <div className="header">
      <h1>
        <MaterialIcon icon="flutter_dash" /> WootWoot!
      </h1>
    </div>
  );
};

export default Header;

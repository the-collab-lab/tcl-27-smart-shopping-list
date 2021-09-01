import React from 'react';
import '../css/bottomNav.css';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import UserToken from './UserToken';

const BottomNav = ({ setLoggedIn }) => {
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <div className="nav-bar">
      {/* <UserToken /> */}
      <ul>
        <li>
          <NavLink className="nav-link" to="/list">
            List
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/add-an-item">
            Add Item
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/" onClick={handleClick}>
            Log Out
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default BottomNav;

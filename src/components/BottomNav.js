import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ setLoggedIn }) => {
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink className="nav-link" to="/list">
            List
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/add-an-item">
            Add an Item
          </NavLink>
        </li>
        <li>
          <button onClick={(e) => handleClick(e)}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import '../css/bottomNav.css';
import { NavLink, useHistory } from 'react-router-dom';

const BottomNav = ({ setLoggedIn }) => {
  const history = useHistory();
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoggedIn(false);
    history.push('/');
  };

  return (
    <div className="nav-bar">
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

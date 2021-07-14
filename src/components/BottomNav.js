import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
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
      </ul>
    </nav>
  );
};

export default BottomNav;

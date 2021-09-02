import React, { useState, useEffect } from 'react';
import '../css/bottomNav.css';
import { NavLink, useHistory } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import MaterialIcon, { menu } from 'material-icons-react';

const BottomNav = ({ setLoggedIn }) => {
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 510;

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoggedIn(false);
    history.push('/');
  };

  if (width > breakpoint) {
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
  }
  return (
    <div className="nav-bar">
      <div className="mb-2">
        <Dropdown drop="up" variant="outline-light">
          <Dropdown.Toggle
            variant="outline-light"
            className="dropdown-btn"
          ></Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item eventKey="1">
              <NavLink className="nav-link" to="/list">
                List
              </NavLink>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2">
              <NavLink className="nav-link" to="/add-an-item">
                Add Item
              </NavLink>
            </Dropdown.Item>
            <Dropdown.Item eventKey="3">
              <NavLink className="nav-link" to="/" onClick={handleClick}>
                Log Out
              </NavLink>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default BottomNav;

import React from 'react';
import '../css/bottomNav.css';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';

const BottomNav = ({ setLoggedIn }) => {
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    // <Navbar fixed="bottom">
    //   <Container>
    //     <NavLink className="nav-link" to="/list">
    //       List
    //     </NavLink>

    //     <NavLink className="nav-link" to="/add-an-item">
    //       Add an Item
    //     </NavLink>

    //     <Navbar.Collapse className="justify-content-end">
    //       <Button onClick={handleClick} variant="outline-info">
    //         Log Out
    //       </Button>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
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
          <Button size="lg" onClick={handleClick} variant="outline-info">
            Log Out
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default BottomNav;

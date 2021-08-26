import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = ({ setLoggedIn }) => {
  // const [redirect, setRedirect] = useState(false)

  const handleClick = (e) => {
    e.preventDefault();
    // setRedirect(true)
    localStorage.clear();
    setLoggedIn(false);
  };

  // const renderRedirect = () => {
  //   if (redirect) {
  //     return <Redirect to='/' />
  //   }
  // }

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
          {/* {renderRedirect()} */}
          <button onClick={(e) => handleClick(e)}>
            Log Out
            {/* <Redirect to='/' /> */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNav;

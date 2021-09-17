import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import GroceryCard from '../GroceryCard';
import BottomNav from '../BottomNav';
import { useHistory } from 'react-router-dom';
import UserToken from '../UserToken';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import MaterialIcon, {
  circle,
  remove_circle,
  stars,
  radio_button_unchecked,
  delete_forever,
} from 'material-icons-react';

const GroceryContainer = ({ setLoggedIn }) => {
  const [grocery, setGrocery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [resetDisplay, setResetDisplay] = useState('none');
  const history = useHistory();

  const ref = fb
    .firestore()
    .collection('groceries')
    .doc(localStorage.getItem('token'))
    .collection('items');

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getGroceries();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const sortByNextPurchaseAndName = (a, b) => {
    if (
      a.nextPurchaseDate.toDate().toDateString() ===
      b.nextPurchaseDate.toDate().toDateString()
    ) {
      return a.itemName - b.itemName;
    }
    return a.nextPurchaseDate > b.nextPurchaseDate ? 1 : -1;
  };

  const sortByInactive = (a, b) => {
    if (a.inactive && b.inactive === true) {
      return a.itemName > b.itemName ? 1 : -1;
    }
    if (a.inactive < b.inactive) return -1;
  };

  const getGroceries = () => {
    ref.onSnapshot((querySnapshot) => {
      const groceries = [];
      querySnapshot.forEach((item) => {
        groceries.push(item.data());
      });
      setGrocery(groceries.sort(sortByNextPurchaseAndName));
      setLoading(false);
    });
  };

  const handleClick = () => {
    history.push('/add-an-item');
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    e.target.value ? setResetDisplay('inline') : setResetDisplay('none');
  };

  const handleResetClick = () => {
    setInput('');
    setResetDisplay('none');
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status" className="m-5">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  if (grocery.length === 0 && !loading) {
    return (
      <div>
        <UserToken />
        <br />
        <p>Your shopping list is currently empty.</p>
        <Button type="submit" variant="outline-secondary" onClick={handleClick}>
          Add an item
        </Button>
        <BottomNav setLoggedIn={setLoggedIn} />
      </div>
    );
  } else {
    return (
      <div>
        <UserToken />
        <label htmlFor="search-field">
          <InputGroup size="md" id="search-field" type="text">
            <FormControl
              onChange={handleChange}
              value={input}
              placeholder="Search Item..."
              aria-label="search-field"
              aria-describedby="inputGroup-sizing-sm"
            />
            <Button
              style={{ display: resetDisplay }}
              onClick={handleResetClick}
              variant="outline-secondary"
              id="button-addon2"
            >
              X
            </Button>
          </InputGroup>
        </label>
        <div className="icon-key">
          <MaterialIcon icon="stars" />
          <span>Soon ~ </span>
          <MaterialIcon icon="circle" />
          <span>Kind of Soon ~ </span>
          <MaterialIcon icon="radio_button_unchecked" />
          <span>Not Soon ~ </span>
          <MaterialIcon icon="remove_circle" />
          <span>Inactive</span>
        </div>
        <br />
        <ul className="list">
          {grocery
            .sort(sortByInactive)
            .filter((g) =>
              g.itemName.toLowerCase().includes(input.toLowerCase()),
            )
            .map((g) => (
              <li key={g.itemName}>
                <GroceryCard item={g} />
              </li>
            ))}
        </ul>
        <BottomNav setLoggedIn={setLoggedIn} />
      </div>
    );
  }
};

export default GroceryContainer;

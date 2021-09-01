import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import GroceryCard from '../GroceryCard';
import BottomNav from '../BottomNav';
import { useHistory } from 'react-router-dom';
import UserToken from '../UserToken';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

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
    return <div>Loading...</div>;
  }
  if (grocery.length === 0 && !loading) {
    return (
      <div>
        <UserToken />
        <p>Your shopping list is currently empty.</p>
        <button type="submit" onClick={handleClick}>
          Add an item
        </button>
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

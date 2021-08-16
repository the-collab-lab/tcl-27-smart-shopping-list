import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import GroceryCard from '../GroceryCard';
import BottomNav from '../BottomNav';
import { useHistory } from 'react-router-dom';

const GroceryContainer = () => {
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
        <h1>Smart Shopping List</h1>
        <p>Your shopping list is currently empty.</p>
        <button type="submit" onClick={handleClick}>
          Add an item
        </button>
        <BottomNav />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Smart Shopping List</h1>
        <label htmlFor="search-field">
          <input
            id="search-field"
            type="text"
            onChange={handleChange}
            value={input}
            placeholder="Search Item..."
          />
        </label>
        <button onClick={handleResetClick} style={{ display: resetDisplay }}>
          X
        </button>
        <ul>
          {grocery
            .filter((g) =>
              g.itemName.toLowerCase().includes(input.toLowerCase()),
            )
            .map((g) => (
              <li key={g.itemName}>
                <GroceryCard item={g} />
              </li>
            ))}
        </ul>
        <BottomNav />
      </div>
    );
  }
};

export default GroceryContainer;

import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import GroceryCard from '../GroceryCard';
import { useHistory } from 'react-router-dom';

const GroceryContainer = () => {
  const [grocery, setGrocery] = useState([]);
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

  const getGroceries = () => {
    ref.onSnapshot((querySnapshot) => {
      const groceries = [];
      querySnapshot.forEach((item) => {
        groceries.push(item.data());
      });
      setGrocery(groceries);
    });
  };

  const handleClick = () => {
    history.push('/add-an-item');
  };

  if (grocery.length === 0) {
    return (
      <div>
        <h1>Smart Shopping List</h1>
        <p>Your shopping list is currently empty.</p>
        <button type="submit" onClick={handleClick}>
          Add an item
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Smart Shopping List</h1>
        <ul>
          {grocery.map((g) => (
            <li key={g.itemName}>
              <GroceryCard item={g} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default GroceryContainer;

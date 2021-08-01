import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import GroceryCard from '../GroceryCard';

const GroceryContainer = () => {
  const [grocery, setGrocery] = useState([]);

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
      console.log(groceries);
      setGrocery(groceries);
    });
  };

  return (
    <div>
      GroceryContainer
      <ul>
        {grocery.map((g) => (
          <li key={g.itemName}>
            <GroceryCard item={g} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryContainer;

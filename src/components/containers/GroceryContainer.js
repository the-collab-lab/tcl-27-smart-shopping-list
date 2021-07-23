import React, { useState, useEffect } from 'react';
import { fb } from '../../lib/firebase';
import uuid from 'react-uuid';
import GroceryCard from '../GroceryCard';
import AddItem from '../AddItem';

const GroceryContainer = () => {
  const [grocery, setGrocery] = useState([]);

  const ref = fb.firestore().collection('groceries');

  useEffect(() => {
    getGroceries();
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

  const postItem = (item) => {
    ref
      .doc(item.id)
      .set(item)
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      GroceryContainer
      <ul>
        {grocery.map((g) => (
          <li key={g.id}>
            <GroceryCard item={g} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryContainer;

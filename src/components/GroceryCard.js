import React, { useState, useEffect } from 'react';
import { fb } from '../lib/firebase';
import firebase from 'firebase/app';

const GroceryCard = ({ item }) => {
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      purchasedTimeLimit();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const ref = fb
    .firestore()
    .collection('groceries')
    .doc(localStorage.getItem('token'))
    .collection('items')
    .doc(item.itemName);

  const updatePurchased = () => {
    if (purchased) {
      ref.update({
        purchased: false,
        checkedTime: firebase.firestore.FieldValue.delete(),
      });
      setPurchased(false);
    } else {
      ref.update({
        purchased: true,
        checkedTime: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setPurchased(true);
    }
  };

  const purchasedTimeLimit = () => {
    if (item.checkedTime) {
      const timeSincePurchased = new Date() - item.checkedTime.toDate();
      const oneFullDay = 24 * 60 * 60 * 1000;
      if (timeSincePurchased > oneFullDay) {
        ref.update({
          purchased: false,
          lastPurchase: item.checkedTime,
          checkedTime: firebase.firestore.FieldValue.delete(),
        });
      } else {
        setPurchased(true);
      }
    }
  };

  return (
    <div>
      <label style={{ display: 'none' }} htmlFor="purchased-checkbox">
        Purchased
      </label>
      <input
        id="purchased-checkbox"
        type="checkbox"
        onChange={() => updatePurchased()}
        value={purchased}
        checked={purchased}
      />
      <p>ITEM: {item.itemName}</p>
      <p>
        LAST PURCHASE DATE:{' '}
        {item.lastPurchase ? item.lastPurchase.toDate().toDateString() : 'NA'}
      </p>
      <p>FREQUENCY: {item.frequency}</p>
    </div>
  );
};

export default GroceryCard;

import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import calculateEstimate from '../lib/estimates';
import { fb } from '../lib/firebase';

const GroceryCard = ({ item }) => {
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    purchasedTimeLimit();
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
      const oneFullDayInMS = 24 * 60 * 60 * 1000;
      if (timeSincePurchased > oneFullDayInMS) {
        let purchaseIntervalInDays;

        if (item.lastPurchase) {
          purchaseIntervalInDays = Math.round(
            (item.checkedTime.toDate() - item.lastPurchase.toDate()) /
              oneFullDayInMS,
          );
        } else {
          purchaseIntervalInDays = 1;
        }

        const purchaseEstimate = calculateEstimate(
          item.purchaseFrequency,
          purchaseIntervalInDays,
          item.numberOfPurchases,
        );
        const nextPurchaseDate = firebase.firestore.Timestamp.fromMillis(
          item.checkedTime.toMillis() + purchaseEstimate * oneFullDayInMS,
        );
        const numberOfPurchases = item.numberOfPurchases + 1;

        ref.update({
          purchased: false,
          lastPurchase: item.checkedTime,
          checkedTime: firebase.firestore.FieldValue.delete(),
          actualPurchaseInterval: purchaseIntervalInDays,
          numberOfPurchases: numberOfPurchases,
          estimatedFrequency: purchaseEstimate,
          nextPurchaseDate: nextPurchaseDate,
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
      <p>
        NEXT ESTIMATED PURCHASE DATE:{' '}
        {item.nextPurchaseDate
          ? item.nextPurchaseDate.toDate().toDateString()
          : ''}
      </p>
    </div>
  );
};

export default GroceryCard;

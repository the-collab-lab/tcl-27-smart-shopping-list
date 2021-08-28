import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import calculateEstimate from '../lib/estimates';
import { fb } from '../lib/firebase';
import {
  format,
  formatDistance,
  formatRelative,
  subDays,
  addDays,
} from 'date-fns';

const GroceryCard = ({ item }) => {
  const [purchased, setPurchased] = useState(false);
  const [timeFrame, setTimeFrame] = useState('');
  const [color, setColor] = useState('white');

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      purchasedTimeLimit();
      setTimeTillNextPurchase();
      inactiveItem();
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

  const oneFullDayInMS = 24 * 60 * 60 * 1000;
  const daysUntilPurchase = Math.round(
    (item.nextPurchaseDate.toDate() - new Date()) / oneFullDayInMS,
  );

  const isInactive = () => {
    let lastPDToEstimatePD;
    let timeSinceLastPurchase;
    const today = new Date();
    const nextPD = item.nextPurchaseDate.toDate();
    const dateAdded = item.dateAdded.toDate();

    if (item.lastPurchase) {
      const lastPD = item.lastPurchase.toDate();
      lastPDToEstimatePD = (nextPD - lastPD) / oneFullDayInMS;
      timeSinceLastPurchase = (today - lastPD) / oneFullDayInMS;
    } else {
      lastPDToEstimatePD = (nextPD - dateAdded) / oneFullDayInMS;
      timeSinceLastPurchase = (today - dateAdded) / oneFullDayInMS;
    }
    return timeSinceLastPurchase >= lastPDToEstimatePD * 2;
  };

  const setTimeTillNextPurchase = () => {
    if (isInactive()) {
      setTimeFrame('Inactive');
      setColor('grey');
    } else {
      if (daysUntilPurchase <= 7) {
        setTimeFrame('Soon');
        setColor('green');
      } else if (daysUntilPurchase > 7 && daysUntilPurchase < 30) {
        setTimeFrame('Kind of Soon');
        setColor('yellow');
      } else if (daysUntilPurchase >= 30) {
        setTimeFrame('Not Soon');
        setColor('red');
      }
    }
  };

  const inactiveItem = () => {
    if (isInactive()) {
      ref.update({
        inactive: true,
      });
    } else {
      ref.update({
        inactive: false,
      });
    }
  };

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

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      ref.delete();
    }
  };

  const purchasedTimeLimit = () => {
    if (item.checkedTime) {
      const timeSincePurchased = new Date() - item.checkedTime.toDate();

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
          item.estimatedFrequency,
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
    <div aria-label={timeFrame} style={{ background: color }}>
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
      <button type="button" onClick={handleDelete}>
        X
      </button>
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

import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import calculateEstimate from '../lib/estimates';
import { fb } from '../lib/firebase';
import Collapsible from 'react-collapsible';
import Accordion from 'react-bootstrap/accordion';
import Card from 'react-bootstrap/Card';
import MaterialIcon, {
  circle,
  remove_circle,
  stars,
  radio_button_unchecked,
  delete_forever,
} from 'material-icons-react';

const GroceryCard = ({ item }) => {
  const [purchased, setPurchased] = useState(false);
  const [timeFrame, setTimeFrame] = useState('');
  const [color, setColor] = useState('white');
  const [opacity, setOpacity] = useState('100%');
  const [itemIcon, setItemIcon] = useState('');

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
      setColor('#8FA2A3');
      setOpacity('50%');
      setItemIcon('remove_circle');
    } else {
      if (daysUntilPurchase <= 7) {
        setTimeFrame('Soon');
        setColor('#52D8E0');
        setOpacity('50%');
        setItemIcon('stars');
      } else if (daysUntilPurchase > 7 && daysUntilPurchase < 30) {
        setTimeFrame('Kind of Soon');
        setColor('#64C9CF');
        setOpacity('50%');
        setItemIcon('circle');
      } else if (daysUntilPurchase >= 30) {
        setTimeFrame('Not Soon');
        setColor('#7BB4B7');
        setOpacity('50%');
        setItemIcon('radio_button_unchecked');
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
    <Accordion flush>
      <Accordion.Item eventKey="0">
        <div className="timeFrame" aria-label={timeFrame}>
          <label style={{ display: 'none' }} htmlFor="purchased-checkbox">
            Purchased
          </label>
          <Accordion.Header>
            <div className="itemName" style={{ background: color }}>
              <MaterialIcon icon={itemIcon} />
              <input
                id="purchased-checkbox"
                type="checkbox"
                onChange={() => updatePurchased()}
                value={purchased}
                checked={purchased}
              />
              {item.itemName}

              <button
                className="deleteButton"
                type="deleteButton"
                onClick={handleDelete}
              >
                <MaterialIcon icon="delete_forever" />
              </button>
            </div>
          </Accordion.Header>
          <Accordion.Body style={{ background: color }}>
            <p>
              LAST PURCHASE DATE:{' '}
              {item.lastPurchase
                ? item.lastPurchase.toDate().toDateString()
                : 'NA'}
            </p>
            <p>
              NEXT ESTIMATED PURCHASE DATE:{' '}
              {item.nextPurchaseDate
                ? item.nextPurchaseDate.toDate().toDateString()
                : ''}
            </p>
          </Accordion.Body>
        </div>
      </Accordion.Item>
    </Accordion>
  );
};

export default GroceryCard;

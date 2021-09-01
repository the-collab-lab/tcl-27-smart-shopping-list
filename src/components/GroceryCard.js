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
import ConfirmModal from './ConfirmModal';

const GroceryCard = ({ item }) => {
  const [purchased, setPurchased] = useState(false);
  const [timeFrame, setTimeFrame] = useState('');
  const [color, setColor] = useState('white');
  const [opacity, setOpacity] = useState('100%');
  const [itemIcon, setItemIcon] = useState('');
  const [confirmView, setConfirmView] = useState(false);

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
    // if (window.confirm('Are you sure?')) {
    ref.delete();
    // }
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
        <label style={{ display: 'none' }} htmlFor="purchased-checkbox">
          Purchased
        </label>
        <Accordion.Header>
          <div className="item-name" style={{ background: color }}>
            <MaterialIcon icon={itemIcon} />
            <input
              id="purchased-checkbox"
              type="checkbox"
              onChange={() => updatePurchased()}
              value={purchased}
              checked={purchased}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
            <span>{item.itemName}</span>
            <button
              className="deleteButton"
              type="deleteButton"
              onClick={(e) => {
                setConfirmView(true);
                e.stopPropagation();
              }}
            >
              <MaterialIcon icon="delete_forever" />
            </button>

            <ConfirmModal
              confirmView={confirmView}
              handleDelete={handleDelete}
              setConfirmView={setConfirmView}
            />
          </div>
        </Accordion.Header>
        <Accordion.Body style={{ background: color }}>
          <p>
            <b>Last Purchase Date:</b>{' '}
            {item.lastPurchase
              ? item.lastPurchase.toDate().toDateString()
              : 'N/A'}
          </p>
          <p>
            <b>Next Estimated Purchase Date:</b>{' '}
            {item.nextPurchaseDate
              ? item.nextPurchaseDate.toDate().toDateString()
              : ''}
          </p>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default GroceryCard;
